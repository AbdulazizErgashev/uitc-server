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

    let where = {};

    Object.keys(queryObj).forEach((key) => {
      if (typeof queryObj[key] === "object") {
        where[key] = {};
        Object.keys(queryObj[key]).forEach((op) => {
          if (["gte", "lte", "gt", "lt"].includes(op)) {
            where[key][op] = Number(queryObj[key][op]);
          }
        });
      } else {
        where[key] = queryObj[key];
      }
    });

    this.queryOptions.where = where;

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const fields = this.queryString.sort.split(",");

      this.queryOptions.orderBy = fields.map((field) => {
        if (field.startsWith("-")) {
          return { [field.substring(1)]: "desc" };
        }
        return { [field]: "asc" };
      });
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

  // async execute() {
  //   return await this.model.findMany(this.queryOptions);
  // }
  async executeWithCount() {
    const where = this.queryOptions.where || {};

    const [data, total] = await Promise.all([
      this.model.findMany(this.queryOptions),
      this.model.count({ where }),
    ]);

    return {
      data,
      total,
    };
  }
}
