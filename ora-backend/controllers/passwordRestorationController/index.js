const jwt = require("jsonwebtoken");

const {
  startPasswordRestorationSchema,
} = require("../../schemas/startPasswordRestorationSchema");
const { connection } = require("../../db/connection");
const {
  PASSWORD_RESTORATION_STATUSES,
} = require("../../db/consts/passwordRestorationStatuses");
const config = require("../../config");
const { updatePasswordSchema } = require("../../schemas/updatePasswordSchema");
const { sendPasswordRestorationMail } = require("../../email");
const { generateHash } = require("../../utils/hash");

const startPasswordRestoration = async (req, res) => {
  try {
    const { value, error } = startPasswordRestorationSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { email } = value;

    const {
      user,
      password_restoration,
      password_restoration_status,
    } = connection.models;

    const existsUsers = await user.findOne({
      where: {
        email,
      },
    });

    if (!existsUsers) {
      return res
        .status(400)
        .send("Пользователь с данной почтой не зарегистрирован.");
    }

    const { dataValues: status } = await password_restoration_status.findOne(
      { where: { name: PASSWORD_RESTORATION_STATUSES.SEND.name } }
    );

    const token = jwt.sign(
      { userId: existsUsers.dataValues.id },
      config.jwt.secret,
      { expiresIn: "30m" }
    );

    await password_restoration.create({
      idPasswordRestorationStatus: status.id,
      token,
    });

    sendPasswordRestorationMail({
      to: email,
      href: `${config.hosts.frontEnd}/restore/update?token=${token}`,
    });

    return res.send();
  } catch (e) {
    res.status(500).send();
  }
};

const updatePassword = async (req, res) => {
  try {
    const { value, error } = updatePasswordSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { token, password } = value;

    const {
      user,
      password_restoration,
      password_restoration_status,
    } = connection.models;

    const { dataValues: status } = await password_restoration_status.findOne(
      { where: { name: PASSWORD_RESTORATION_STATUSES.SEND.name } }
    );

    const passwordUpdatingProcess = await password_restoration.findOne({
      where: { idPasswordRestorationStatus: status.id, token },
    });

    if (!passwordUpdatingProcess) {
      return res
        .status(400)
        .send("Информация для обновления пароля не актуальна.");
    }

    const verifiedToken = jwt.verify(token, config.jwt.secret);

    const { userId } = verifiedToken;

    const userToBeUpdated = await user.findOne({
      where: {
        id: userId,
      },
    });

    if (!userToBeUpdated) {
      return res
        .status(400)
        .send("Обновить пароль можно только для актуальных пользователей.");
    }

    const newPassword = generateHash(password);

    if (newPassword === userToBeUpdated.dataValues.password) {
      return res
        .status(400)
        .send("Новый пароль должен отличаться от текущего.");
    }

    await user.update(
      { password: newPassword },
      { where: { id: userId } }
    );

    const { dataValues: completeRestorationStatus } =
      await password_restoration_status.findOne({
        where: { name: PASSWORD_RESTORATION_STATUSES.ACTIVATED.name },
      });

    await password_restoration.update(
      { idPasswordRestorationStatus: completeRestorationStatus.id },
      { where: { token } }
    );

    return res.send();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res
        .status(400)
        .send("Время действия токена истекло. Запросите новую ссылку.");
    }
    res.status(500).send();
  }
};

module.exports = {
  startPasswordRestoration,
  updatePassword,
};
