const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const responseCode = require("../config/responses");
const tokenControl = require("../middlewares/basicToken");

const model = initModels(sequelize);

// START XỬ LÍ LIKE NHÀ HÀNG
// --- Like (nhà hàng)

// --- Unlike (nhà hàng)
// END XỬ LÍ LIKE NHÀ HÀNG
