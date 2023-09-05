import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandsEntity } from 'src/brands/entities';
import { ILike, Repository } from 'typeorm';
import {
  BrandsCreateDto,
  BrandsQueryDto,
  BrandsUpdateDto,
} from 'src/brands/dtos';
import { APIFeatures } from 'src/shared/utils';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(BrandsEntity)
    private brandsRepository: Repository<BrandsEntity>,
  ) {}

  public create(payload: BrandsCreateDto) {
    const brand = this.brandsRepository.create({
      ...payload,
    });

    return this.brandsRepository.save(brand);
  }

  public findByHostname(hostname: string) {
    return this.brandsRepository.findOne({
      where: {
        hostname,
      },
    });
  }
  public findByName(name: string) {
    return this.brandsRepository.findOne({
      where: {
        name,
      },
    });
  }
  public findByNameCaseInsensitive(name: string) {
    return this.brandsRepository.findOne({
      where: {
        name: ILike(name),
      },
    });
  }

  public getAll(query: BrandsQueryDto) {
    const searchableFields = ['name', 'description'];
    const apiFeatures = new APIFeatures<BrandsEntity, BrandsQueryDto>(
      this.brandsRepository,
      query,
    )
      .paginate()
      .sort()
      .filter()
      .search(searchableFields);

    return apiFeatures.findAllAndCount();
  }

  public async update(id: number, body: Partial<BrandsUpdateDto>) {
    const brand = await this.brandsRepository.preload({ id, ...body });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return this.brandsRepository.save(brand);
  }

  public findById(id: number) {
    return this.brandsRepository.findOne({
      where: {
        id,
      },
    });
  }
}
