import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewValueRecycleDonateEnum1689658552883
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TYPE recycle_donate ADD VALUE 'USPS First Class'",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TYPE recycle_donate DROP VALUE 'USPS First Class'",
    );
  }
}
