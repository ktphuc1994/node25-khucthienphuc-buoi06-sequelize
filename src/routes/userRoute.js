const express = require("express");
const userController = require("../controllers/userController");
const userRoute = express.Router();

userRoute.post("/likeres", userController.likeRes);
userRoute.delete("/unlikeres", userController.unlikeRes);

module.exports = userRoute;
