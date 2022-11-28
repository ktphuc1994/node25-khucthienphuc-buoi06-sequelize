const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

// import config
const responseCode = require("../config/responses");

// import local utils
const { checkDataExist, checkReqData } = require("../utils/utils");

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
    responseCode.notFound(
      response,
      { user_id: userID },
      "User does not existed"
    );
    return false;
  }
  if (!isRestaurantExist) {
    responseCode.notFound(
      response,
      { res_id: resID },
      "Restaurant does not existed"
    );
    return false;
  }
  return true;
};

const userController = {
  // START XỬ LÍ LIKE NHÀ HÀNG
  // --- Like (nhà hàng)
  likeRes: async (req, res) => {
    try {
      let { user_id, res_id } = req.body;

      const isDataGood = checkReqData(res, user_id, res_id);
      if (!isDataGood) {
        return;
      }

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
        responseCode.conflic(res, "", "Already liked the Restaurant");
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

      const isDataGood = checkReqData(res, user_id, res_id);
      if (!isDataGood) {
        return;
      }

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
      if (!isLiked) {
        responseCode.conflic(res, "", "Not liked the Restaurant yet");
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
  getLikeResList: async (req, res) => {
    try {
      const { user_id } = req.body;

      const isDataGood = checkReqData(res, user_id);
      if (!isDataGood) {
        return;
      }

      const isUserExist = await checkDataExist("user", "user_id", user_id);
      if (!isUserExist) {
        responseCode.notFound(res, { user_id }, "User does not exist");
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
  // END XỬ LÍ LIKE NHÀ HÀNG

  // START XỬ LÍ ĐÁNH GIÁ NHÀ HÀNG
  // --- Thêm đánh giá nhà hàng
  addResRate: async (req, res) => {
    try {
      let { user_id, res_id, amount } = req.body;

      const isDataGood = checkReqData(res, user_id, res_id, amount);
      if (!isDataGood) {
        return;
      }

      user_id = Number(user_id);
      res_id = Number(res_id);
      amount = Number(amount);

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

      const isRated = await models.rate_res.findOne({
        where: { user_id, res_id },
      });
      if (isRated) {
        const result = await models.rate_res.update(
          { amount, date_rate: Date.now() },
          { where: { user_id, res_id } }
        );
        responseCode.success(
          res,
          result,
          "Updated restaurant rate successfully"
        );
        return;
      }

      const result = await models.rate_res.create({
        user_id,
        res_id,
        amount,
        date_rate: Date.now(),
      });
      responseCode.created(res, result, "Rated restaurant successfully");
    } catch (err) {
      responseCode.error(res, "Lỗi Backend");
    }
  },

  // --- Lấy danh sách nhà hàng được đánh giá (theo user)
  getRateResList: async (req, res) => {
    try {
      const { user_id } = req.body;

      const isDataGood = checkReqData(res, user_id);
      if (!isDataGood) {
        return;
      }

      const isUserExist = await checkDataExist("user", "user_id", user_id);
      if (!isUserExist) {
        responseCode.notFound(res, { user_id }, "User does not exist");
        return;
      }

      const result = await models.rate_res.findAll({
        include: "resDetail",
        attributes: ["date_rate", "amount"],
        where: { user_id },
      });

      if (result.length === 0) {
        responseCode.success(
          res,
          result,
          "User hasn't rated any restaurant yet"
        );
        return;
      }

      responseCode.success(res, result, "Get restaurant list successfully");
    } catch (err) {
      responseCode.error(res, "Lỗi Backend");
    }
  },
  // END XỬ LÍ ĐÁNH GIÁ NHÀ HÀNG
};

module.exports = userController;
