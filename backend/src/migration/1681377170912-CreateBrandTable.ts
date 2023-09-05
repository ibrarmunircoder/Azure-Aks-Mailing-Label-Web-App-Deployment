import { BrandsEntity } from 'src/brands/entities';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBrandTable1681377170912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'brand',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'hostname',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'logo',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            onUpdate: 'now()',
          },
        ],
      }),
    );
    await queryRunner.manager.save(BrandsEntity, {
      name: 'Benefit',
      hostName: '',
    });
    await queryRunner.manager.save(BrandsEntity, {
      name: 'Mane',
      hostName: '',
    });
    await queryRunner.manager.save(BrandsEntity, {
      name: 'Ilia',
      hostName: '',
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('brand');
  }
}
