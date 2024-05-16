const { connection } = require("../db/connection");
const UserType = require("../db/models/UserType");
const UserTypeMap = require("../db/models/UserTypeMap");

const isValidUserByType = (userTypeName) => async (req, res, next) => {
  try {
    const UserTypeModel = await UserType(connection);
    const UserTypeMapModel = await UserTypeMap(connection);

    const { dataValues: userTypeData } = await UserTypeModel.findOne({
      where: {
        name: userTypeName,
      },
    });

    const userTypeMap = await UserTypeMapModel.findOne({
      where: {
        id: req.params.userTypeMapId,
        idUserType: userTypeData.id,
      },
    });

    if (!userTypeMap) {
      return res.status(400).send("Пользователь не найден.");
    }

    next();
  } catch (e) {
    return res.status(400).send("Ошибка валидации пользователя.");
  }
};

module.exports = { isValidUserByType };
