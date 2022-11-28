const sequelize = require("../models/index");
const initModels = require("../models/init-models");
const models = initModels(sequelize);

// import local config
const responseCode = require("../config/responses");

const checkDataExist = async (tableName, idKey, idValue) => {
  const isDataExist = await models[tableName].findOne({
    where: { [idKey]: idValue },
  });
  if (isDataExist) return true;
  return false;
};

const checkReqData = (res, ...reqData) => {
  for (const data of reqData) {
    if (!data) {
      responseCode.failSyntax(res, "", "Missing or incorrect request data");
      return false;
    }
  }
  return true;
};

module.exports = { checkDataExist, checkReqData };
