import { AddressEntity } from 'src/addresses/entities';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class brandSponsordToMailBack1691644923499
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const addressRepository = queryRunner.manager.getRepository(AddressEntity);

    const brandSponsoredAddresses = await addressRepository.find({
      where: {
        program: 'Brand Sponsored',
      },
    });

    if (brandSponsoredAddresses?.length) {
      await Promise.all(
        brandSponsoredAddresses.map((address) =>
          addressRepository.update(
            { id: address.id },
            { program: 'Mail Back-Brand Supported' },
          ),
        ),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const addressRepository = queryRunner.manager.getRepository(AddressEntity);

    const brandSponsoredAddresses = await addressRepository.find({
      where: {
        program: 'Mail Back-Brand Supported',
      },
    });

    if (brandSponsoredAddresses?.length) {
      await Promise.all(
        brandSponsoredAddresses.map((address) =>
          addressRepository.update(
            { id: address.id },
            { program: 'Brand Sponsored' },
          ),
        ),
      );
    }
  }
}
