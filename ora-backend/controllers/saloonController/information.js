const fs = require("fs");
const moment = require("moment");

const { saloonBaseServicesSchema } = require("../../schemas/saloonBaseServicesSchema");
const { saloonUpdatingSchema } = require("../../schemas/saloonUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { connection } = require("../../db/connection");
const { getUserData } = require("../userController");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const { SERVICE_INSTANCE_STATUSES } = require("../../db/consts/serviceInstanceStatuses");

const updateSaloon = async (req, res) => {
  try {
    const { value, error } = saloonUpdatingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const {
      saloon_info,
      user_image,
    } = connection.models;

    const { description, mainImage } = value;

    await saloon_info.update(
      { description },
      {
        where: {
          idUserTypeMap: +req.params.userTypeMapId,
        },
      }
    );

    if (mainImage) {
      const { data, fileName, fileType } = mainImage;

      if (
        data.indexOf(",") === -1 ||
        fileType.indexOf("image/") !== 0 ||
        fileName.indexOf(".") < 1 ||
        !IMAGE_EXTENSIONS.includes(fileName.split(".")[1].toLowerCase())
      ) {
        return res.status(400).send("Неверный формат/размер изображения.");
      }

      const saloonMainImageInfo = await user_image.findOne({
        where: { idUserTypeMap: +req.params.userTypeMapId, isMain: true },
      });

      const dirName = "/userUploads/" + req.params.userTypeMapId + "/images/";
      const fullDirName = "public" + dirName;
      const imageName = dirName + fileName;
      const fullImageName = "public" + imageName;

      if (!fs.existsSync(fullDirName)) {
        fs.mkdirSync(fullDirName, { recursive: true });
      }

      if (saloonMainImageInfo && saloonMainImageInfo.dataValues) {
        const oldImageFullName = "public" + saloonMainImageInfo.dataValues.url;

        if (fs.existsSync(oldImageFullName)) {
          fs.unlinkSync(oldImageFullName);
        }
      }

      let buff = new Buffer.from(data.split(",")[1], "base64");
      fs.writeFileSync(fullImageName, buff);

      if (saloonMainImageInfo && saloonMainImageInfo.dataValues) {
        await user_image.update(
          {
            url: imageName,
          },
          {
            where: {
              id: saloonMainImageInfo.dataValues.id,
            },
          }
        );
      } else {
        await user_image.create({
          idUserTypeMap: +req.params.userTypeMapId,
          url: imageName,
          isMain: true,
        });
      }
    }

    return await getUserData(req, res);
  } catch (e) {
    res.status(500).send();
  }
};

const getSaloonBaseInfo = async (req, res) => {
  try {
    const {
      saloon_info,
      street_type,
      user_image,
      city,
    } = connection.models;

    const [saloonInfo] = await connection.query(
      `SELECT si.idUserTypeMap as id, si.name as name, si.description as description, si.workingTime as workingTime, si.visitPayment as visitPayment, c.name as cityName, si.idStreetType as idStreetType, si.street as street, si.building as building, si.stage as stage, si.office as office, si.xCoordinate as xCoordinate, si.yCoordinate as yCoordinate, uim.url as mainImage
      FROM \`${saloon_info.tableName}\` si
      JOIN \`${city.tableName}\` c
      ON si.idCity = c.id
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${user_image.tableName}\`
        WHERE isMain = 1
      ) uim
      ON uim.idUserTypeMap = si.idUserTypeMap
      WHERE si.idUserTypeMap = ${req.params.userTypeMapId}`
    );

    if (!saloonInfo.length) {
      return res.status(404).send();
    }

    const { idStreetType, ...rest } = saloonInfo[0];

    let streetType = "";

    // TODO: сделать в предыдущем запросе
    if (idStreetType) {
      const { dataValues } = await street_type.findOne({ where: { id: idStreetType } });
      streetType = dataValues.shortName;
    }

    return res.send({ ...rest, streetType });
  } catch (e) {
    res.status(500).send();
  }
};

const getSaloonBaseServices = async (req, res) => {
  try {
    const { value, error } = saloonBaseServicesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const {
      procedure,
      service,
    } = connection.models;

    const { pageNumber, pageSize } = value;
    const offset = pageSize * (pageNumber - 1);

    const total = await service.count({ where: { idSaloon: req.params.userTypeMapId } });

    const [services] = total === 0 || offset >= total
      ? [[]]
      : await connection.query(
        `SELECT s.id as id, p.id as procedureId, p.name as procedureName
        FROM \`${service.tableName}\` s
        JOIN \`${procedure.tableName}\` p
        ON s.idProcedure = p.id
        WHERE s.idSaloon = ${req.params.userTypeMapId}
        LIMIT ${pageSize}
        OFFSET ${offset}`
      );

    return res.send({
      data: services,
      total,
    });
  } catch (e) {
    res.status(500).send();
  }
};

const getSaloonTimetable = async (req, res) => {
  try {
    const date = moment(req.params.date, "DD-MM-YYYY", true);

    if (!date.isValid()) {
      return res.status(400).send("Неверный формат даты.");
    }

    const {
      service_master_map_status,
      service_instance_status,
      service_master_map,
      service_instance,
      user_type_map,
      user_image,
      procedure,
      service,
      user,
    } = connection.models;

    // TODO: не фильтровал по связке салон-мастер. Думаю.
    const [serviceInstancesList] = await connection.query(
      `SELECT si.id as id, p.name as procedureName, si.time as start, s.time as time, smm.idMaster as idMaster
        FROM \`${service_instance.tableName}\` si
        JOIN \`${service_instance_status.tableName}\` sis
        ON si.idServiceInstanceStatus = sis.id
        JOIN \`${service_master_map.tableName}\` smm
        ON si.idServiceMasterMap = smm.id
        JOIN \`${service_master_map_status.tableName}\` smms
        ON smm.idServiceMasterMapStatus = smms.id
        JOIN \`${service.tableName}\` s
        ON smm.idService = s.id
        JOIN \`${procedure.tableName}\` p
        ON s.idProcedure = p.id
        WHERE s.idSaloon = ${req.params.userTypeMapId}
        AND si.time LIKE '${date.format("YYYY-MM-DD")}:%'
        AND sis.name = '${SERVICE_INSTANCE_STATUSES.applied.name}'
        AND smms.name = '${SERVICES_MASTER_MAP_STATUSES.active.name}'`
    );

    if (!serviceInstancesList.length) {
      return res.send({
        data: [],
      });
    }

    const mastersIds = [...new Set(serviceInstancesList.map(({ idMaster }) => idMaster))];

    const [masters] = await connection.query(
      `SELECT utm.id as id, u.name as name, uim.url as mainImage
      FROM \`${user.tableName}\` u
      JOIN \`${user_type_map.tableName}\` utm
      ON u.id = utm.idUser
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${user_image.tableName}\`
        WHERE isMain = 1
      ) uim
      ON uim.idUserTypeMap = utm.id
      WHERE utm.id IN (${mastersIds.join(',')})`
    );

    const result = masters.reduce((accum, master) => {
      const serviceInstances = serviceInstancesList
        .filter(({ idMaster }) => idMaster === master.id)
        .map(({ id, procedureName, start, time }) => {
          const startTime = moment(start, "YYYY-MM-DD:HH-mm", true).toISOString();

          const [hours, minutes] = time.split(':');

          const finishTime = moment(start, "YYYY-MM-DD:HH-mm", true).add(+hours, "hours").add(+minutes, "minutes").toISOString();

          return {
            id,
            procedureName,
            start: startTime,
            finish: finishTime,
          };
        });

      return [
        ...accum,
        {
          ...master,
          serviceInstances,
        },
      ];
    }, []);

    return res.send(result);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  updateSaloon,
  getSaloonBaseInfo,
  getSaloonBaseServices,
  getSaloonTimetable,
};
