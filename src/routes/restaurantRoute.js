const express = require("express");
const restaurantRoute = express.Router();

// import controller
const restaurantController = require("../controllers/restaurantController");

restaurantRoute.get("/likelist", restaurantController.getLikeUserList);
restaurantRoute.get("/ratelist", restaurantController.getRateUserList);

module.exports = restaurantRoute;
