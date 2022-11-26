const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const responseCode = require("../config/responses");
const tokenControl = require("../middlewares/basicToken");

const model = initModels(sequelize);

const checkDataExist = async (tableName, idKey, idValue) => {
  const isDataExist = await model[tableName].findOne({
    where: { [idKey]: idValue },
  });
  if (isDataExist) return true;
  return false;
};
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
    responseCode.fail(response, { user_id: userID }, "User is not existed");
    return false;
  }
  if (!isRestaurantExist) {
    responseCode.fail(response, { res_id: resID }, "Restaurant is not existed");
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

      const isLiked = await model.like_res.findOne({
        where: { user_id, res_id },
      });
      // console.log(isLiked);
      if (isLiked) {
        responseCode.fail(res, "", "Already liked the Restaurant");
        return;
      }
      const result = await model.like_res.create({
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

      const isLiked = await model.like_res.findOne({
        where: { user_id, res_id },
      });
      console.log(isLiked);
      if (!isLiked) {
        responseCode.fail(res, "", "Not liked the Restaurant yet");
        return;
      }

      const result = await model.like_res.destroy({
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
};
// END XỬ LÍ LIKE NHÀ HÀNG

module.exports = userController;
