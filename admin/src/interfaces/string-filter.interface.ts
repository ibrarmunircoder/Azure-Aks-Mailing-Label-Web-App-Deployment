import {
  BetweenFilterInterface,
  DateRangeFilterInterface,
  EqualToFilterInterface,
  ILikeFilterInterface,
  LessThanEqualFilterInterface,
  IsNullFilterInterface,
  LikeFilterInterface,
  MoreThanEqualFilterInterface,
  NotEqualToFilterInterface,
  ValueInFilterInterface,
  ValueNotInFilterInterface,
} from "interfaces";

export interface StringFilterInterface
  extends EqualToFilterInterface<string>,
    NotEqualToFilterInterface<string>,
    ValueInFilterInterface<string>,
    ValueNotInFilterInterface<string>,
    LikeFilterInterface<string>,
    ILikeFilterInterface<string>,
    LessThanEqualFilterInterface<string>,
    MoreThanEqualFilterInterface<string>,
    BetweenFilterInterface<DateRangeFilterInterface>,
    IsNullFilterInterface<string> {}
