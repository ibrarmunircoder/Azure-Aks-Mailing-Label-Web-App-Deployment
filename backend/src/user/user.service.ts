import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  UserAssignBrandsDto,
  UserCreateDto,
  UserIsActiveDto,
  UserUpdateDto,
  UsersQueryDto,
} from 'src/user/dtos';
import { UserEntity, UserBrandsAssignedEntity } from 'src/user/entities';
import { APIFeatures } from 'src/shared/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserBrandsAssignedEntity)
    private userBrandsAssignedRepository: Repository<UserBrandsAssignedEntity>,
  ) {}

  public async create(payload: UserCreateDto) {
    const { assignedBrands, ...userPayload } = payload;
    const isEmailTaken = await this.findByEmail(payload.email);

    if (isEmailTaken) {
      throw new BadRequestException(
        'the user with this email is already exist!',
      );
    }
    const user = this.userRepository.create({
      ...userPayload,
      password: await this.hashData(userPayload.password),
    });
    const userEntity = await this.userRepository.save(user);
    if (userEntity && assignedBrands?.length) {
      await this.assignBrands({
        userId: userEntity.id,
        brands: assignedBrands,
      });
    }
    return userEntity;
  }

  public async update(id: number, payload: Partial<UserUpdateDto>) {
    const userEntity = await this.userRepository.preload({
      id,
      ...payload,
    });

    if (!userEntity) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }

    return this.userRepository.save(userEntity);
  }

  public async assignBrands(payload: UserAssignBrandsDto) {
    const { userId, brands } = payload;

    const userBrands = brands.map((brand) =>
      this.userBrandsAssignedRepository.create({
        userId,
        brandId: brand,
      }),
    );

    await Promise.all(
      userBrands.map((userBrand) =>
        this.userBrandsAssignedRepository.save(userBrand),
      ),
    );
    return null;
  }

  public getAll(query: UsersQueryDto) {
    const searchableFields = ['firstName', 'lastName', 'email', 'isActive'];
    const apiFeatures = new APIFeatures<UserEntity, UsersQueryDto>(
      this.userRepository,
      query,
    )
      .paginate()
      .sort()
      .filter()
      .search(searchableFields);

    return apiFeatures.findAllAndCount({
      relations: ['userBrandsAssigned', 'userBrandsAssigned.brand'],
    });
  }

  public getUserBrands(userId: number) {
    return this.userBrandsAssignedRepository.find({
      where: {
        userId,
      },
    });
  }

  public async activateUser(body: UserIsActiveDto) {
    const userEntity = await this.findById(body.id);

    if (!userEntity) {
      throw new NotFoundException(`User with email ${body.id} not found`);
    }

    return this.update(userEntity.id, { active: body.active });
  }

  public hashData(password: string) {
    return bcrypt.hash(password, 10);
  }

  public findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }
  public findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
