const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const { userStatuses } = require("../../db/consts/userStatuses");
const { generateHash } = require("../../utils/hash");
const { userLoginSchema } = require("../../schemas/userLoginSchema");
const { createToken } = require("../../utils/jwt");

const loginUser = async (req, res) => {
  try {
    const { value, error } = userLoginSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { email, password, userType } = value;

    const {
      user,
      user_status,
      user_type,
      user_type_map,
    } = connection.models;

    const existsUser = await user.findOne({
      where: { email, password: generateHash(password) },
    });

    if (!existsUser) {
      return res.status(400).send("Пользователь не найден.");
    }

    const { dataValues: activeUserStatus } = await user_status.findOne({
      where: { name: userStatuses.active.name },
    });

    const userTypes = (
      await user_type_map.findAll({
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
          await user_type.findAll({
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
