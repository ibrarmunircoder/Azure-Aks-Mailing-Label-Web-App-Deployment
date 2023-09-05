import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCarrierColumn1689657726151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'address',
      new TableColumn({
        name: 'carrier',
        type: 'varchar',
        default: "'USPS'",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('address', 'carrier');
  }
}
