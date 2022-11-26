const express = require("express");
const restaurantRoute = express.Router();

// import controller
const restaurantController = require("../controllers/restaurantController");

restaurantRoute.get("/likelist", restaurantController.getUserLikeList);

module.exports = restaurantRoute;
