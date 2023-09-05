import { RecycleDonateEnum } from 'src/addresses/enums';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addRecycleDonateColumn1681707634447 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'address',
      new TableColumn({
        name: 'recycleDonate',
        type: 'enum',
        enum: Object.values(RecycleDonateEnum),
        enumName: 'recycle_donate',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('address', 'recycleDonate');
  }
}
