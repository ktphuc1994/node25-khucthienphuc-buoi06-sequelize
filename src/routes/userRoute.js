const express = require("express");
const userRoute = express.Router();

// import controller
const userController = require("../controllers/userController");

userRoute.get("/likelist", userController.getResLikeList);
userRoute.post("/likeres", userController.likeRes);
userRoute.delete("/unlikeres", userController.unlikeRes);

module.exports = userRoute;
