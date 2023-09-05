import {
  EqualToFilterInterface,
  NotEqualToFilterInterface,
} from 'src/shared/interfaces';

export interface BooleanFilterInterface
  extends EqualToFilterInterface<boolean>,
    NotEqualToFilterInterface<boolean> {}
