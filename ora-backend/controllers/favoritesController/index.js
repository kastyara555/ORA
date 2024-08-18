const { Op } = require("sequelize");

const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const { favoritesSchema } = require("../../schemas/favoritesSchema");
const { getFavoritesSchema } = require("../../schemas/getFavoritesSchema");
const { checkFavoritesSchema } = require("../../schemas/checkFavoritesSchema");

const saveFavorites = async (req, res) => {
  try {
    const { value, error } = favoritesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const {
      user_type_map,
      user_type,
      favorites,
    } = connection.models;

    const [clientInfo] = await connection.query(
      `SELECT utm.id as id
      FROM ${user_type_map.tableName} utm
      JOIN ${user_type.tableName} ut
      ON utm.idUserType = ut.id
      WHERE utm.id = ${value.idClient}
      AND ut.name = '${roles.client.name}'`
    );

    if (!clientInfo.length) {
      return res.status(400).send("Отсутствует информация о клиенте");
    }

    const favoritesOfClient = (await favorites.findAll({
      where: {
        idClient: value.idClient,
      },
    })).map(({ dataValues }) => ({
      idClient: dataValues.idClient,
      idService: dataValues.idService,
    }));

    if (favoritesOfClient.length >= 16) {
      return res.status(400).send("Доступно 16 слотов для избранных услуг");
    }

    if (favoritesOfClient.find(({ idClient, idService }) => idClient === value.idClient && idService === value.idService)) {
      return res.status(400).send("Избранное уже существует");
    }

    await favorites.create({
      idClient: value.idClient,
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

    const {
      user_type_map,
      user_type,
      favorites,
    } = connection.models;

    const [clientInfo] = await connection.query(
      `SELECT utm.id as id
      FROM ${user_type_map.tableName} utm
      JOIN ${user_type.tableName} ut
      ON utm.idUserType = ut.id
      WHERE utm.id = ${value.idClient}
      AND ut.name = '${roles.client.name}'`
    );

    if (!clientInfo.length) {
      return res.status(400).send("Отсутствует информация о клиенте");
    }

    const favoritesOfClient = await favorites.findOne({
      where: {
        idClient: value.idClient,
        idService: value.idService,
      },
    });

    if (!favoritesOfClient) {
      return res.status(400).send("Отсутствует информация о данной услуге в избранном");
    }

    await favorites.destroy({
      where: {
        id: favoritesOfClient.dataValues.id,
      },
    });

    return res.send({});
  } catch (e) {
    res.status(500).send();
  }
};

const checkFavorites = async (req, res) => {
  try {
    const { value, error } = checkFavoritesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    if (!value.idServices.length) {
      return res.send([]);
    }

    const {
      favorites,
    } = connection.models;

    const favoritesList = (await favorites.findAll({
      where: {
        idClient: value.idClient,
        idService: {
          [Op.in]: value.idServices,
        },
      }
    })).map(({ dataValues }) => dataValues.idService);

    return res.send(favoritesList);
  } catch (e) {
    res.status(500).send();
  }
};

const getFavorites = async (req, res) => {
  try {
    const { value, error } = getFavoritesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const {
      procedure,
      service,
      favorites,
      saloon_info,
      city,
      user_image,
    } = connection.models;

    const subQueryMainImages = `SELECT idUserTypeMap, url
      FROM ${user_image.tableName}
      WHERE isMain = 1`;

    const [favoritesList] = await connection.query(
      `SELECT s.id as id, si.idUserTypeMap as saloonId, si.name as saloonName, uim.url as mainImage, p.id as procedureId, p.name as procedureName, c.name as cityName
      FROM ${favorites.tableName} f
      JOIN ${service.tableName} s
      ON f.idService = s.id
      JOIN ${saloon_info.tableName} si
      ON s.idSaloon = si.idUserTypeMap
      JOIN ${procedure.tableName} p
      ON s.idProcedure = p.id
      JOIN ${city.tableName} c
      ON si.idCity = c.id
      LEFT JOIN (${subQueryMainImages}) uim
      ON uim.idUserTypeMap = si.idUserTypeMap
      WHERE f.idClient = ${value.idClient}`
    );

    return res.send(favoritesList);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getFavorites,
  saveFavorites,
  clearFavorites,
  checkFavorites,
};
