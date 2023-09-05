import { Address } from 'interfaces';
const dayjs = require('dayjs');

export const changeAddressFieldsName = (data: Address) => {
  return {
    'Date Generated': dayjs(data.createdAt).format('MMM DD, YYYY'),
    Name: `${data.firstName} ${data.lastName.split('-')[0]}`,
    Carrier: data.carrier,
    Member: data.brand.name,
    'Program Type': data.program,
    Email: data.email,
    'Email Status': data.emailStatus || 'delivered',
    Brand: data.brand?.name,
    Attention: data.recycleDonate,
    'Tracking #': data.trackingNumber,
    'Delivery Status': data?.status || '-',
    'Date of Delivery': data?.deliveryDate || '-',
    'Address Line 1': data.addressLine1,
    'Address Line': data.addressLine2,
    City: data.city,
    ZIP: data.zipcode,
    State: data.state,
  };
};
