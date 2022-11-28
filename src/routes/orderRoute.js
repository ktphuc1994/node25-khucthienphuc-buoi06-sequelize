const express = require("express");
const orderRoute = express.Router();

// import controller
const orderController = require("../controllers/orderController");

orderRoute.post("/create", orderController.orderFood);

module.exports = orderRoute;
