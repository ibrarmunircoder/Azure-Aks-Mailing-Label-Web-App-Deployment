import { UserEntity } from 'src/user/entities';
import { UserRoleEnum } from 'src/user/enums';

const MaskData = require('maskdata');

const maskJSONOptions = {
  maskWith: '*',
  fields: ['program'],
};

export const maskAddressesData = (data: any, user: UserEntity) => {
  let addresses = data[0];
  if (![UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN].includes(user.role)) {
    const maskedAddresses = [];
    for (const address of addresses) {
      const maskedAddress = MaskData.maskJSONFields(address, maskJSONOptions);
      maskedAddresses.push(maskedAddress);
    }
    addresses = maskedAddresses;
  }
  data[0] = addresses;
  return data;
};
