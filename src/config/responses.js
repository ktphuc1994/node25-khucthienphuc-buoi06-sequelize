const responseCode = {
  success: (res, data, message) => {
    res.status(200).json({
      message,
      content: data,
    });
  },
  fail: (res, data, message) => {
    res.status(400).json({
      message,
      content: data,
    });
  },
  error: (res, message) => {
    res.status(500).send(message);
  },
};

module.exports = responseCode;
