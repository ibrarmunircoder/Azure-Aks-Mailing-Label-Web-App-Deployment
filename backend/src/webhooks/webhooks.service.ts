import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressesService } from 'src/addresses/addresses.service';

@Injectable()
export class WebhooksService {
  constructor(private addressService: AddressesService) {}

  public async updateEmailStatus(
    emailId: string,
    status: string,
    reason: string,
  ) {
    const addressEntity = (
      await this.addressService.getAll({
        filter: {
          emailId: { equalTo: emailId },
        },
      })
    )[0][0];

    if (!addressEntity) {
      throw new NotFoundException(
        `Address with email id ${emailId} not found!`,
      );
    }

    return this.addressService.update(addressEntity.id, {
      emailStatus: status,
      emailFailedReason: reason,
    });
  }
}
