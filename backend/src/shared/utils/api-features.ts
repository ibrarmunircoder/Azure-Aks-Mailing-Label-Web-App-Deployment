// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Repository,
  FindManyOptions,
  FindOperator,
  MoreThan,
  MoreThanOrEqual,
  LessThan,
  LessThanOrEqual,
  Equal,
  ILike,
  Like,
  Not,
  In,
  Between,
  IsNull,
} from 'typeorm';
import { DateRangeFilterInterface } from 'src/shared/interfaces';

const operatorsConfig = {
  equalTo: Equal,
  notEqualTo: (value: T | FindOperator<T>) => Not(Equal(value)),
  moreThan: MoreThan,
  lessThan: LessThan,
  moreThanEqual: MoreThanOrEqual,
  lessThanEqual: LessThanOrEqual,
  valueIn: In,
  valueNotIn: (value: readonly T[] | FindOperator<T>) => Not(In(value)),
  between: (value: DateRangeFilterInterface) => Between(value.from, value.to),
  like: Like,
  iLike: ILike,
  isNull: IsNull,
};

export class APIFeatures<T1, T2> {
  private options: FindManyOptions<T1>;
  constructor(private repository: Repository<T1>, private query: T2) {
    this.query = query;
    this.repository = repository;
  }

  public search(searchableFields: string[]) {
    if (this.query.search) {
      this.options = {
        ...this.options,
        where: searchableFields.map((field) => ({
          [field]: ILike(`%${this.query.search}%`),
        })),
      };
    }
    return this;
  }

  public filter() {
    if (this.query.filter) {
      const filterWhere = Object.keys(this.query.filter).reduce(
        (where, fieldName) => {
          const operator = Object.keys(this.query.filter[fieldName]).map(
            (operatorName) =>
              operatorsConfig[operatorName](
                this.query.filter[fieldName][operatorName],
              ),
          )[0];
          where[fieldName] = operator;
          return where;
        },
        {},
      );
      this.options = {
        ...this.options,
        where: filterWhere,
      };
    }
    return this;
  }

  public selectFields() {
    if (this.query.fields) {
      const select = this.query.fields.reduce(
        (obj: Record<string, boolean>, field: string) => {
          obj[field] = true;
          return obj;
        },
        {},
      );
      this.options = {
        ...this.options,
        select,
      };
    }
    return this;
  }

  public paginate() {
    const offset = this.query.offset || 0;
    const limit = this.query.limit;

    this.options = {
      ...this.options,
      skip: offset,
      take: limit,
      ...(limit ? { take: limit } : {}),
    };

    return this;
  }

  public sort() {
    if (this.query.order) {
      const { sort, order } = this.query.order;
      this.options = {
        ...this.options,
        order: {
          [sort]: order,
        },
      };
    } else {
      this.options = {
        ...this.options,
        order: {
          createdAt: 'ASC',
        },
      };
    }
    return this;
  }

  public findAllAndCount(options?: FindManyOptions<T2> = {}) {
    return this.repository.findAndCount({
      ...this.options,
      ...options,
    });
  }
}
