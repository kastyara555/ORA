const { connection } = require("../db/connection");
const { roles } = require("../db/consts/roles");
const UserType = require("../db/models/UserType");
const UserTypeMap = require("../db/models/UserTypeMap");

const isValidSaloon = async (req, res, next) => {
  try {
    const UserTypeModel = await UserType(connection);
    const UserTypeMapModel = await UserTypeMap(connection);

    const { dataValues: saloonUserTypeData } = await UserTypeModel.findOne({
      where: {
        name: roles.saloon.name,
      },
    });

    const userTypeMap = await UserTypeMapModel.findOne({
      where: {
        id: req.params.userTypeMapId,
        idUserType: saloonUserTypeData.id,
      },
    });

    if (!userTypeMap) {
      return res.status(400).send("Пользователь не найден.");
    }

    next();
  } catch (e) {
    return res.status(400).send("Ошибка валидации салона.");
  }
};

module.exports = { isValidSaloon };
