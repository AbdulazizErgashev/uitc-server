export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let status = 500;
  let message = "Internal Server Error";

  if (err.name === "ValidationError") {
    status = 400;
    message = err.message;
  } else if (err.code === "P2002") {
    status = 409; // Prisma unique constraint
    message = "Duplicate field value entered";
  } else if (err.statusCode) {
    status = err.statusCode;
    message = err.message;
  }

  res.status(status).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
