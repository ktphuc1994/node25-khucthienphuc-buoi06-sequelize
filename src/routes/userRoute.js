const express = require("express");
const userRoute = express.Router();

// import controller
const userController = require("../controllers/userController");

userRoute.get("/likelist", userController.getLikeResList);
userRoute.post("/likeres", userController.likeRes);
userRoute.delete("/unlikeres", userController.unlikeRes);
userRoute.get("/ratelist", userController.getRateResList);
userRoute.post("/rateres", userController.addResRate);

module.exports = userRoute;
