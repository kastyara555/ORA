const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const User = require("../../db/models/User");
const UserType = require("../../db/models/UserType");
const UserStatus = require("../../db/models/UserStatus");
const UserTypeMap = require("../../db/models/UserTypeMap");
const { userStatuses } = require("../../db/consts/userStatuses");
const { generateHash } = require("../../utils/hash");
const { userLoginSchema } = require("../../schemas/userLoginSchema");
const { createToken } = require("../../utils/jwt");

const loginUser = async (req, res) => {
  try {
    const { value, error } = userLoginSchema.validate(req.body);

    if (error)
      return res.status(400).send("Проверьте правильность введённых данных");

    const { email, password, userType } = value;

    const UserModel = await User(connection);
    const UserStatusModel = await UserStatus(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserTypeModel = await UserType(connection);

    const existsUser = await UserModel.findOne({
      where: { email, password: generateHash(password) },
    });

    if (!existsUser) {
      return res.status(400).send("Пользователь не найден.");
    }

    const { dataValues: activeUserStatus } = await UserStatusModel.findOne({
      where: { name: userStatuses.active.name },
    });

    const userTypes = (
      await UserTypeMapModel.findAll({
        where: {
          idUser: existsUser.dataValues.id,
          idUserStatus: activeUserStatus.id,
        },
      })
    ).map(({ dataValues }) => dataValues);

    if (!userTypes.length) {
      return res.status(400).send("Пользователь не найден.");
    }

    if (userTypes.length > 1) {
      if (!userType) {
        const availableUserTypes = (
          await UserTypeModel.findAll({
            where: {
              id: {
                [Op.in]: userTypes.map(({ idUserType }) => idUserType),
              },
            },
          })
        ).map(({ dataValues }) => ({
          id: dataValues.id,
          name: dataValues.name,
        }));

        return res.send({ availableUserTypes });
      }

      const currentUserType = userTypes.find(
        ({ idUserType }) => idUserType === userType
      );

      if (!currentUserType) {
        return res.status(400).send("Пользователь не найден.");
      }

      return res.send({
        token: createToken(currentUserType.id),
      });
    }

    if (userType && userTypes[0].idUserType !== userType) {
      return res.status(400).send("Пользователь не найден.");
    }

    return res.send({ token: createToken(userTypes[0].id) });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  loginUser,
};
