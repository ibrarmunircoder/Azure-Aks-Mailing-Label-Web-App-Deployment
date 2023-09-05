import { ClassTransformOptions, plainToClass } from 'class-transformer';
import { UserEntity } from 'src/user/entities';
import { UserRoleEnum } from 'src/user/enums';
import { AdminAddressResponseDto } from 'src/addresses/dtos';

export const hideColumns = (data: any, user: UserEntity) => {
  let addresses = data[0];
  if (![UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN].includes(user.role)) {
    const transformedAddresses = [];
    for (const address of addresses) {
      const options: ClassTransformOptions = {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      };
      const transformedAddress = plainToClass(
        AdminAddressResponseDto,
        address,
        options,
      );
      transformedAddresses.push(transformedAddress);
    }
    addresses = transformedAddresses;
  }
  data[0] = addresses;
  return data;
};
