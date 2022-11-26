const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

// import config
const responseCode = require("../config/responses");

// import middleware
const tokenControl = require("../middlewares/basicToken");

// import local utils
const { checkDataExist } = require("../utils/utils");

const checkUserRestaurantExist = async (
  response,
  userTable,
  userKey,
  userID,
  restaurantTable,
  resKey,
  resID
) => {
  const PromiseCheckUser = checkDataExist(userTable, userKey, userID);
  const PromistCheckRestaurant = checkDataExist(restaurantTable, resKey, resID);
  const isUserExist = await PromiseCheckUser;
  const isRestaurantExist = await PromistCheckRestaurant;
  if (!isUserExist) {
    responseCode.fail(response, { user_id: userID }, "User does not existed");
    return false;
  }
  if (!isRestaurantExist) {
    responseCode.fail(
      response,
      { res_id: resID },
      "Restaurant does not existed"
    );
    return false;
  }
  return true;
};

// START XỬ LÍ LIKE NHÀ HÀNG
// --- Like (nhà hàng)
const userController = {
  likeRes: async (req, res) => {
    try {
      let { user_id, res_id } = req.body;
      user_id = Number(user_id);
      res_id = Number(res_id);

      const isUserRestaurantExist = await checkUserRestaurantExist(
        res,
        "user",
        "user_id",
        user_id,
        "restaurant",
        "res_id",
        res_id
      );
      if (!isUserRestaurantExist) {
        return;
      }

      const isLiked = await models.like_res.findOne({
        where: { user_id, res_id },
      });
      // console.log(isLiked);
      if (isLiked) {
        responseCode.fail(res, "", "Already liked the Restaurant");
        return;
      }
      const result = await models.like_res.create({
        user_id,
        res_id,
        date_like: Date.now(),
      });
      // console.log(result);
      responseCode.success(res, result, "Liked restaurant successfully");
    } catch (err) {
      responseCode.error(res, "Lỗi Backend");
    }
  },

  // --- Unlike (nhà hàng)
  unlikeRes: async (req, res) => {
    try {
      let { user_id, res_id } = req.body;
      user_id = Number(user_id);
      res_id = Number(res_id);

      const isUserRestaurantExist = await checkUserRestaurantExist(
        res,
        "user",
        "user_id",
        user_id,
        "restaurant",
        "res_id",
        res_id
      );
      if (!isUserRestaurantExist) {
        return;
      }

      const isLiked = await models.like_res.findOne({
        where: { user_id, res_id },
      });
      console.log(isLiked);
      if (!isLiked) {
        responseCode.fail(res, "", "Not liked the Restaurant yet");
        return;
      }

      const result = await models.like_res.destroy({
        where: {
          user_id,
          res_id,
        },
      });
      responseCode.success(res, result, "Unliked restaurant successfully");
    } catch (err) {
      responseCode.error(res, "Lỗi Backend");
    }
  },

  // --- Lấy danh sách nhà hàng được người dùng like
  getResLikeList: async (req, res) => {
    try {
      const { user_id } = req.body;

      const isUserExist = await checkDataExist("user", "user_id", user_id);
      if (!isUserExist) {
        responseCode.fail(res, { user_id }, "User does not exist");
        return;
      }

      const result = await models.like_res.findAll({
        include: "resDetail",
        attributes: ["date_like"],
        where: { user_id },
      });

      if (result.length === 0) {
        responseCode.success(
          res,
          result,
          "User hasn't liked any restaurant yet"
        );
        return;
      }

      responseCode.success(res, result, "Get restaurant list successfully");
    } catch (err) {
      responseCode.error(res, "Lỗi Backend");
    }
  },
};
// END XỬ LÍ LIKE NHÀ HÀNG

module.exports = userController;
