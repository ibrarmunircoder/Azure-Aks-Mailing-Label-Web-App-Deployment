import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddNewAddressTableColumns1686733864513
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'address',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'address',
      new TableColumn({
        name: 'deliveryDate',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('address', 'deliveryDate');
    await queryRunner.dropColumn('address', 'status');
  }
}
