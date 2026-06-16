import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // Search by specific fields (e.g., title or content)
  search(searchableFields: string[]) {
    const search = this?.query?.search;

    if (search) {
      const searchConditions = {
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: search, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      };
      this.modelQuery = this.modelQuery.find(searchConditions);
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    // Fields to exclude from filter
    const excludeFields = [
      'search',
      'sort',
      'limit',
      'page',
      'fields',
      'startDate',
      'endDate',
      'userInvolved',
      'service',
    ];

    excludeFields.forEach((el) => delete queryObj[el]);
    const finalFilter: Record<string, any> = {};

    for (const key in queryObj) {
      const value = queryObj[key];

      if (
        value === '' ||
        value === null ||
        value === undefined ||
        value === 'null'
      ) {
        continue;
      }

      if (key.endsWith('_ne')) {
        const actualKey = key.replace('_ne', '');
        finalFilter[actualKey] = { $ne: value };
      } else {
        finalFilter[key] = value;
      }
    }

    const { startDate, endDate } = this.query as {
      startDate?: string;
      endDate?: string;
    };

    if (startDate || endDate) {
      finalFilter.date = {};
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0);
        finalFilter.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        finalFilter.date.$lte = end;
      }
    }

    if (this.query.userInvolved) {
      const userId = this.query.userInvolved;
      finalFilter.$or = [{ assignedBy: userId }, { assignedTo: userId }];
    }

    this.modelQuery = this.modelQuery.find(finalFilter);
    return this;
  }

  // Sort by a specific field and order
  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') ||
      'order -date -createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);

    return this;
  }

  // Pagination
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit);
    const skip = limit ? (page - 1) * limit : 0;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // Select specific fields
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // Count total documents
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit);
    const pages = limit ? Math.ceil(total / limit) : Math.ceil(total / 0);

    return {
      page,
      limit,
      total,
      pages,
    };
  }
}

export default QueryBuilder;
