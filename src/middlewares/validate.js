export const validate =
  (schema, type = "body") =>
  (req, res, next) => {
    let data;
    if (type === "body") data = req.body;
    else if (type === "query") data = req.query;
    else if (type === "params") data = req.params;

    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }

    if (type === "body") req.body = result.data;
    else if (type === "query") req.query = result.data;
    else if (type === "params") req.params = result.data;

    next();
  };
