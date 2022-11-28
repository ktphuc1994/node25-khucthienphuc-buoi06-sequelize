const express = require("express");
const rootRoute = express.Router();

// import local routes
const restaurantRoute = require("./restaurantRoute");
const userRoute = require("./userRoute");
const orderRoute = require("./orderRoute");

// import config
const responseCode = require("../config/responses");

// import middleware
const tokenControl = require("../middlewares/basicToken");

rootRoute.post("/newtoken", (req, res) => {
  try {
    const data = req.body;
    const newToken = tokenControl.create(data);
    responseCode.created(res, newToken, "Token created");
  } catch (err) {
    responseCode.error(res, "Lỗi Backend");
  }
});

rootRoute.use("/restaurant", tokenControl.verify, restaurantRoute);
rootRoute.use("/user", tokenControl.verify, userRoute);
rootRoute.use("/order", tokenControl.verify, orderRoute);

module.exports = rootRoute;
