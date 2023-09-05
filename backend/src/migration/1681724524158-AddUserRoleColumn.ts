import { UserRoleEnum } from 'src/user/enums';
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserRoleColumn1681724524158 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'user',
      new TableColumn({
        name: 'role',
        type: 'enum',
        default: "'user'",
        isNullable: false,
        enum: Object.values(UserRoleEnum),
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user', 'role');
  }
}
