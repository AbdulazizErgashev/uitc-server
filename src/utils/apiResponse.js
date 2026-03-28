export const successResponse = (res, data, message = "Success", meta = {}) => {
  return res.status(200).json({
    success: true,
    message,
    count: Array.isArray(data) ? data.length : undefined,
    ...meta,
    data,
  });
};

export const errorResponse = (
  res,
  message = "Something went wrong",
  status = 500,
) => {
  return res.status(status).json({
    success: false,
    message,
  });
};
