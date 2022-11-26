const express = require("express");
const rootRoute = express.Router();

// import local routes
const restaurantRoute = require("./restaurantRoute");
const userRoute = require("./userRoute");

rootRoute.use("/restaurant", restaurantRoute);
rootRoute.use("/user", userRoute);

module.exports = rootRoute;
