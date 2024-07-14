const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const UserType = require("../../db/models/UserType");
const Favorites = require("../../db/models/Favorites");
const UserTypeMap = require("../../db/models/UserTypeMap");
const { favoritesSchema } = require("../../schemas/favoritesSchema");

const saveFavorites = async (req, res) => {
  try {
    const { value, error } = favoritesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const UserTypeModel = await UserType(connection);
    const FavoritesModel = await Favorites(connection);
    const UserTypeMapModel = await UserTypeMap(connection);

    const [clientInfo] = await connection.query(
      `SELECT utm.id as id
      FROM \`${UserTypeMapModel.tableName}\` utm
      JOIN \`${UserTypeModel.tableName}\` ut
      ON utm.idUserType = ut.id
      WHERE utm.id = ${req.params.userTypeMapId}
      AND ut.name = '${roles.client.name}'`
    );

    if (!clientInfo.length) {
      return res.status(400).send("Отсутствует информация о клиенте");
    }

    const favoritesOfClient = (await FavoritesModel.findAll({
      where: {
        idClient: req.params.userTypeMapId,
      },
    })).map(({ dataValues }) => ({
      idClient: dataValues.idClient,
      idService: dataValues.idService,
    }));

    if (favoritesOfClient.length >= 16) {
      return res.status(400).send("Доступно 16 слотов для избранных услуг");
    }

    if (favoritesOfClient.find(({ idClient, idService }) => idClient === +req.params.userTypeMapId && idService === value.idService)) {
      return res.status(400).send("Избранное уже существует");
    }

    await FavoritesModel.create({
      idClient: req.params.userTypeMapId,
      idService: value.idService,
    });

    return res.send({});
  } catch (e) {
    res.status(500).send();
  }
};

const clearFavorites = async (req, res) => {
  try {
    const { value, error } = favoritesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const UserTypeModel = await UserType(connection);
    const FavoritesModel = await Favorites(connection);
    const UserTypeMapModel = await UserTypeMap(connection);

    const [clientInfo] = await connection.query(
      `SELECT utm.id as id
      FROM \`${UserTypeMapModel.tableName}\` utm
      JOIN \`${UserTypeModel.tableName}\` ut
      ON utm.idUserType = ut.id
      WHERE utm.id = ${req.params.userTypeMapId}
      AND ut.name = '${roles.client.name}'`
    );

    if (!clientInfo.length) {
      return res.status(400).send("Отсутствует информация о клиенте");
    }

    const favoritesOfClient = await FavoritesModel.findOne({
      where: {
        idClient: req.params.userTypeMapId,
        idService: value.idService,
      },
    });

    if (!favoritesOfClient) {
      return res.status(400).send("Отсутствует информация о данной услуге в избранном");
    }

    await FavoritesModel.destroy({
      where: {
        id: favoritesOfClient.dataValues.id,
      },
    });

    return res.send({});
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  saveFavorites,
  clearFavorites,
};
