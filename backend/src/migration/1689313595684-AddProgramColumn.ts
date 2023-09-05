import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddProgramColumn1689313595684 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'address',
      new TableColumn({
        name: 'program',
        type: 'varchar',
        default: "'Brand-Support Program'",
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('address', 'program');
  }
}
