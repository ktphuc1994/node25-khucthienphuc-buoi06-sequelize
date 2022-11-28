const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

// import config
const responseCode = require("../config/responses");

// import local utils
const { checkDataExist, checkReqData } = require("../utils/utils");

const orderController = {
  orderFood: async (req, res) => {
    try {
      let { user_id, food_id, amount, code, arr_sub_id } = req.body;

      const isDataGood = checkReqData(
        res,
        user_id,
        food_id,
        amount,
        code,
        arr_sub_id
      );
      if (!isDataGood) {
        return;
      }

      user_id = Number(user_id);
      food_id = Number(food_id);
      amount = Number(amount);

      const isUserExist = await checkDataExist("user", "user_id", user_id);
      if (!isUserExist) {
        responseCode.notFound(res, { user_id }, "User does not exist");
        return;
      }

      const isFoodExist = await checkDataExist("food", "food_id", food_id);
      if (!isFoodExist) {
        responseCode.notFound(res, { food_id }, "Food does not exist");
        return;
      }

      const isOrderExist = await models.order.findOne({
        where: { user_id, food_id },
      });
      if (isOrderExist) {
        responseCode.conflic(
          res,
          { user_id, food_id },
          "Order has already existed, please try other combo of User and Food. I know it is stupid for not allowing a user to order many orders of one food, but please bare with the system"
        );
        return;
      }

      const result = await models.order.create({
        user_id,
        food_id,
        amount,
        code,
        arr_sub_id,
      });
      responseCode.created(res, result, "Order created");
    } catch (err) {
      responseCode.error(res, "Lỗi Backend");
    }
  },
};

module.exports = orderController;
