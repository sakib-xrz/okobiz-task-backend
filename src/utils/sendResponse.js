const sendResponse = (res, data) => {
  const responseData = {
    statusCode: data ? data.statusCode : undefined,
    success: data ? data.success : undefined,
    message: data ? data.message || null : null,
    meta: data ? data.meta || null : undefined,
    data: data ? data.data || null : null,
  };

  res.status(data ? data.statusCode : undefined).json(responseData);
};

module.exports = sendResponse;
