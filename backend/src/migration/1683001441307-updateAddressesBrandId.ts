import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export class updateAddressesBrandId1683001441307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'brand',
      new TableColumn({
        name: 'templateName',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'address',
      new TableColumn({
        name: 'emailId',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'address',
      new TableColumn({
        name: 'emailStatus',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'address',
      new TableColumn({
        name: 'emailFailedReason',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('brand', 'templateName');
    await queryRunner.dropColumn('address', 'emailId');
    await queryRunner.dropColumn('address', 'emailStatus');
    await queryRunner.dropColumn('address', 'emailFailedReason');
  }
}
