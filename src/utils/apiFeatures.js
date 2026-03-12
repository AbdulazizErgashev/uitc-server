// utils/apiFeatures.js
export class APIFeatures {
  constructor(model, queryString) {
    this.model = model; // Prisma model, masalan prisma.testimonial
    this.queryString = queryString;
    this.queryOptions = {}; // Prisma findMany options
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort"];
    excludedFields.forEach((el) => delete queryObj[el]);

    if (Object.keys(queryObj).length > 0) {
      this.queryOptions.where = queryObj;
    }

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      this.queryOptions.orderBy = {
        [this.queryString.sort]: "asc",
      };
    }
    return this;
  }

  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Math.min(Number(this.queryString.limit) || 10, 100);

    this.queryOptions.skip = (page - 1) * limit;
    this.queryOptions.take = limit;

    return this;
  }

  async execute() {
    return await this.model.findMany(this.queryOptions);
  }
}
