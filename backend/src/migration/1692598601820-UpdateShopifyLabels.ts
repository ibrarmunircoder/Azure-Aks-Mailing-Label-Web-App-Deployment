import { AddressEntity } from 'src/addresses/entities';
import { In, MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateShopifyLabels1692598601820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const addressRepository = queryRunner.manager.getRepository(AddressEntity);

    const addresses = await addressRepository.find({
      where: {
        id: In([802, 787, 779, 723, 686, 570, 543]),
      },
    });

    if (addresses?.length) {
      await Promise.all(
        addresses.map((address) =>
          addressRepository.update(
            { id: address.id },
            { carrier: 'Canada Post' },
          ),
        ),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const addressRepository = queryRunner.manager.getRepository(AddressEntity);

    const addresses = await addressRepository.find({
      where: {
        id: In([802, 787, 779, 723, 686, 570, 543]),
      },
    });

    if (addresses?.length) {
      await Promise.all(
        addresses.map((address) =>
          addressRepository.update({ id: address.id }, { carrier: 'USPS' }),
        ),
      );
    }
  }
}
