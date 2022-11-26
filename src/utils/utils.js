const sequelize = require("../models/index");
const initModels = require("../models/init-models");

const model = initModels(sequelize);

const checkDataExist = async (tableName, idKey, idValue) => {
  const isDataExist = await model[tableName].findOne({
    where: { [idKey]: idValue },
  });
  if (isDataExist) return true;
  return false;
};

module.exports = { checkDataExist };
