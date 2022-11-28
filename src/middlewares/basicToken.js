const jwt = require("jsonwebtoken");
const responseCode = require("../config/responses");

const tokenControl = {
  create: (data) => {
    const token = jwt.sign({ data }, process.env.SECRECT_KEY, {
      algorithm: "HS256",
      expiresIn: "2d",
    });
    return token;
  },
  check: (token) => {
    try {
      const checkToken = jwt.verify(token, process.env.SECRECT_KEY);
      return { checkData: true, message: "" };
    } catch (err) {
      return { checkData: false, message: err.message };
    }
  },
  verify: function (req, res, next) {
    const { token } = req.headers;
    const verifyToken = this.check(token);
    if (verifyToken.checkData) {
      next();
      return;
    }
    responseCode.fail(res, "Token không hợp lệ", verifyToken.message);
  },
};

module.exports = tokenControl;
