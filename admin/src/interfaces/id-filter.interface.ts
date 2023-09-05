import {
  EqualToFilterInterface,
  NotEqualToFilterInterface,
  ValueInFilterInterface,
  ValueNotInFilterInterface,
} from "interfaces";

export interface IdFilterInterface
  extends EqualToFilterInterface<number>,
    NotEqualToFilterInterface<number>,
    ValueInFilterInterface<number>,
    ValueNotInFilterInterface<number> {}
