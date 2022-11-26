const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

// import config
const responseCode = require("../config/responses");

// import middleware
const tokenControl = require("../middlewares/basicToken");

// import local utils
const { checkDataExist } = require("../utils/utils");

// START XỬ LÍ LIKE NHÀ HÀNG
// --- Lấy danh sách người dùng đã like nhà hàng
const restaurantController = {
  getUserLikeList: async (req, res) => {
    try {
      const { res_id } = req.body;

      const isResExist = await checkDataExist("restaurant", "res_id", res_id);
      if (!isResExist) {
        responseCode.fail(res, { res_id }, "Restaurant does not exist");
        return;
      }

      const result = await models.like_res.findAll({
        include: {
          model: models.user,
          as: "userDetail",
          attributes: ["user_id", "full_name", "email"],
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
};
// END XỬ LÍ LIKE NHÀ HÀNG

module.exports = restaurantController;
