import { BrandsEntity } from 'src/brands/entities';
import { UserBrandsAssignedEntity, UserEntity } from 'src/user/entities';
import { UserRoleEnum } from 'src/user/enums';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserRole1683871075110 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersRepository = queryRunner.manager.getRepository(UserEntity);
    const brandRepository = queryRunner.manager.getRepository(BrandsEntity);

    const userAssignedBrandRepository = queryRunner.manager.getRepository(
      UserBrandsAssignedEntity,
    );
    const benefitBrand = await brandRepository.findOne({
      where: {
        name: 'Benefit',
      },
    });

    const users = await usersRepository.find({});
    for (let i = 0; i < users.length; i++) {
      await usersRepository.update(users[i].id, { role: UserRoleEnum.USER });
      const brandassigned = await userAssignedBrandRepository.create({
        brandId: benefitBrand.id,
        userId: users[0].id,
      });
      await userAssignedBrandRepository.save(brandassigned);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
