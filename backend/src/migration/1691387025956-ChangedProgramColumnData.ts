import { AddressEntity } from 'src/addresses/entities';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangedProgramColumnData1691387025956
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const addressRepository = queryRunner.manager.getRepository(AddressEntity);

    const mailBackAddresses = await addressRepository.find({
      where: {
        program: 'Mailback',
      },
    });

    if (mailBackAddresses?.length) {
      await Promise.all(
        mailBackAddresses.map((address) =>
          addressRepository.update(
            { id: address.id },
            { program: 'Mail Back-Customer Supported' },
          ),
        ),
      );
    }

    const brandSupportAddresses = await addressRepository.find({
      where: {
        program: 'Brand-Support Program',
      },
    });

    if (brandSupportAddresses?.length) {
      await Promise.all(
        brandSupportAddresses.map((address) =>
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

    const mailBackAddresses = await addressRepository.find({
      where: {
        program: 'Mail Back-Customer Supported',
      },
    });

    if (mailBackAddresses?.length) {
      await Promise.all(
        mailBackAddresses.map((address) =>
          addressRepository.update({ id: address.id }, { program: 'Mailback' }),
        ),
      );
    }

    const brandSupportAddresses = await addressRepository.find({
      where: {
        program: 'Mail Back-Brand Supported',
      },
    });

    if (brandSupportAddresses?.length) {
      await Promise.all(
        brandSupportAddresses.map((address) =>
          addressRepository.update(
            { id: address.id },
            { program: 'Brand-Support Program' },
          ),
        ),
      );
    }
  }
}
