const responseCode = {
  success: (res, data, message) => {
    res.status(200).json({
      message,
      content: data,
    });
  },
  created: (res, data, message) => {
    res.status(201).json({
      message,
      content: data,
    });
  },
  failSyntax: (res, data, message) => {
    res.status(400).json({
      message,
      content: data,
    });
  },
  notFound: (res, data, message) => {
    res.status(404).json({
      message,
      content: data,
    });
  },
  conflic: (res, data, message) => {
    res.status(409).json({
      message,
      content: data,
    });
  },
  error: (res, message) => {
    res.status(500).send(message);
  },
};

module.exports = responseCode;
