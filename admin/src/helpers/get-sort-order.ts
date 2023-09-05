import { OrderEnum } from "enums";

export const getSortOrder = (order: OrderEnum | string) => {
  return order === OrderEnum.ASC ? OrderEnum.ASC : OrderEnum.DESC;
};
