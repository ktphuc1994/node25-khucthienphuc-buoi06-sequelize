const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

// import config
const responseCode = require("../config/responses");

// import local utils
const { checkDataExist, checkReqData } = require("../utils/utils");

const restaurantController = {
  // START XỬ LÍ LIKE NHÀ HÀNG
  // --- Lấy danh sách người dùng đã like nhà hàng
  getLikeUserList: async (req, res) => {
    try {
      const { res_id } = req.body;

      const isDataGood = checkReqData(res, res_id);
      if (!isDataGood) {
        return;
      }

      const isResExist = await checkDataExist("restaurant", "res_id", res_id);
      if (!isResExist) {
        responseCode.notFound(res, { res_id }, "Restaurant does not exist");
        return;
      }

      const result = await models.like_res.findAll({
        include: {
          model: models.user,
          as: "userDetail",
          attributes: { exclude: ["pass_word"] },
        },
        attributes: ["date_like"],
        where: { res_id },
      });

      if (result.length === 0) {
        responseCode.success(res, result, "Restaurant hasn't got any like yet");
        return;
      }

      responseCode.success(res, result, "Get user like list successfully");
    } catch (err) {
      responseCode.error(res, "Lỗi Backend");
    }
  },
  // END XỬ LÍ LIKE NHÀ HÀNG

  // START XỬ LÍ ĐÁNH GIÁ NHÀ HÀNG
  // --- Lấy danh sách user đã đánh giá nhà hàng
  getRateUserList: async (req, res) => {
    try {
      const { res_id } = req.body;

      const isDataGood = checkReqData(res, res_id);
      if (!isDataGood) {
        return;
      }

      const isRestaurantExist = await checkDataExist(
        "restaurant",
        "res_id",
        res_id
      );
      if (!isRestaurantExist) {
        responseCode.notFound(res, { res_id }, "Restaurant does not exist");
        return;
      }

      const result = await models.rate_res.findAll({
        include: "userDetail",
        attributes: ["date_rate", "amount"],
        where: { res_id },
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

module.exports = restaurantController;
