const { connection } = require("../db/connection");

const isValidUserByType = (userTypeName) => async (req, res, next) => {
  try {

    const { dataValues: userTypeData } = await connection.models.user_type.findOne({
      where: {
        name: userTypeName,
      },
    });

    const userTypeMap = await connection.models.user_type_map.findOne({
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
