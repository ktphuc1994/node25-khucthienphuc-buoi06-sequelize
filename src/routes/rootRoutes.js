const express = require("express");
const rootRoute = express.Router();

// import local routes
const restaurantRoute = require("./restaurantRoute");
const userRoute = require("./userRoute");
const orderRoute = require("./orderRoute");

rootRoute.use("/restaurant", restaurantRoute);
rootRoute.use("/user", userRoute);
rootRoute.use("/order", orderRoute);

module.exports = rootRoute;
