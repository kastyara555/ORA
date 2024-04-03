const { Op } = require("sequelize");
const moment = require("moment");

const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const SaloonMasterMap = require("../../db/models/SaloonMasterMap");
const SaloonInfo = require("../../db/models/SaloonInfo");
const UserImage = require("../../db/models/UserImage");
const { connection } = require("../../db/connection");

const timetableAvailability = async (req, res) => {
  try {
    const ServiceMasterMapModel = await ServiceMasterMap(connection);

    const existsServices = await ServiceMasterMapModel.findOne({
      where: { idMaster: req.params.userTypeMapId },
    });

    return res.send({
      isTimetableAvailable: !!existsServices,
    });
  } catch (e) {
    res.status(500).send();
  }
};

const timetableInformation = async (req, res) => {
  try {
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const SaloonMasterMapModel = await SaloonMasterMap(connection);
    const UserImageModel = await UserImage(connection);
    const SaloonInfoModel = await SaloonInfo(connection);

    if (req.params.date.length !== 10) {
      return res.status(400).send("Неверный формат даты.");
    }

    const date = moment(req.params.date, "DD-MM-YYYY", true);

    if (!date.isValid()) {
      return res.status(400).send("Неверный формат даты.");
    }

    if (!date.isSameOrAfter(moment(), "day")) {
      return res
        .status(400)
        .send("Получить расписание можно только для сегодня и будущих дней.");
    }

    const existsServices = await ServiceMasterMapModel.findOne({
      where: { idMaster: req.params.userTypeMapId },
    });

    if (!existsServices) {
      res.send(null);
    }

    const [saloonsTmp] = await connection.query(
      `SELECT smm.idSaloon as id, si.name as name
      FROM \`${SaloonMasterMapModel.tableName}\` smm
      JOIN \`${SaloonInfoModel.tableName}\` si
      ON smm.idSaloon = si.idUserTypeMap
      WHERE smm.idMaster = ${req.params.userTypeMapId}`
    );

    const saloonsIds = saloonsTmp.map(({ id }) => id);

    const saloonsImages = saloonsIds.length
      ? await UserImageModel.findAll({
          where: { idUserTypeMap: { [Op.in]: saloonsIds }, isMain: 1 },
          attributes: ["idUserTypeMap", "url"],
        })
      : [];

    const saloonsImagesMap = saloonsImages.reduce(
      (accum, { dataValues: { idUserTypeMap, url } }) => ({
        ...accum,
        [idUserTypeMap]: url,
      }),
      {}
    );

    const saloons = saloonsTmp.map(({ id, name }) => ({
      name,
      id,
      mainImage: saloonsImagesMap[id] ?? null,
    }));

    const timeTable = [];

    return res.send({
      saloons,
      timeTable,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

module.exports = { timetableAvailability, timetableInformation };
