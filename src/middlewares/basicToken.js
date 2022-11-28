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
  verify: (req, res, next) => {
    try {
      const { authtoken } = req.headers;
      const verifyToken = tokenControl.check(authtoken);
      if (verifyToken.checkData) {
        next();
        return;
      }
      responseCode.unauthorized(res, "Token không hợp lệ", verifyToken.message);
    } catch (err) {
      responseCode.error(res, "Lỗi Backend");
    }
  },
};

module.exports = tokenControl;
