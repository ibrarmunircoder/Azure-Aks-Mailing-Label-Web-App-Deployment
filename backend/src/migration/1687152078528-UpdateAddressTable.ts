import { AddressEntity } from 'src/addresses/entities';
import {
  IsNull,
  MigrationInterface,
  Not,
  QueryRunner,
  TableColumn,
} from 'typeorm';
import * as dayjs from 'dayjs';

export class UpdateAddressTable1687152078528 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'address',
      'deliveryDate',
      new TableColumn({
        name: 'deliveryDate',
        type: 'date',
        isNullable: true,
      }),
    );

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'address',
      'deliveryDate',
      new TableColumn({
        name: 'deliveryDate',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }
}
