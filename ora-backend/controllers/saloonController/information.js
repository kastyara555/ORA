const fs = require("fs");
const moment = require("moment");

const { saloonBaseServicesSchema } = require("../../schemas/saloonBaseServicesSchema");
const { saloonUpdatingSchema } = require("../../schemas/saloonUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { connection } = require("../../db/connection");
const ServiceMasterMapStatus = require("../../db/models/ServiceMasterMapStatus");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const ServiceInstance = require("../../db/models/ServiceInstance");
const UserTypeMap = require("../../db/models/UserTypeMap");
const SaloonInfo = require("../../db/models/SaloonInfo");
const StreetType = require("../../db/models/StreetType");
const UserImage = require("../../db/models/UserImage");
const Procedure = require("../../db/models/Procedure");
const Service = require("../../db/models/Service");
const City = require("../../db/models/City");
const User = require("../../db/models/User");
const { getUserData } = require("../userController");
const { SERVICES_MASTER_MAP_STATUSES } = require("../../db/consts/serviceMasterMapStatuses");
const { SERVICE_INSTANCE_STATUSES } = require("../../db/consts/serviceInstanceStatuses");

const updateSaloon = async (req, res) => {
  try {
    const SaloonInfoModel = await SaloonInfo(connection);
    const UserImageModel = await UserImage(connection);

    const { value, error } = saloonUpdatingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { description, mainImage } = value;

    await SaloonInfoModel.update(
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
        !IMAGE_EXTENSIONS.includes(fileName.split(".")[1])
      ) {
        return res.status(400).send("Неверный формат/размер изображения.");
      }

      const saloonMainImageInfo = await UserImageModel.findOne({
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
        await UserImageModel.update(
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
        await UserImageModel.create({
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
    const SaloonInfoModel = await SaloonInfo(connection);
    const StreetTypeModel = await StreetType(connection);
    const UserImageModel = await UserImage(connection);
    const CityModel = await City(connection);

    const [saloonInfo] = await connection.query(
      `SELECT si.idUserTypeMap as id, si.name as name, si.description as description, si.workingTime as workingTime, c.name as cityName, st.shortName as streetType, si.street as street, si.building as building, si.stage as stage, si.office as office, uim.url as mainImage
      FROM \`${SaloonInfoModel.tableName}\` si
      JOIN \`${CityModel.tableName}\` c
      ON si.idCity = c.id
      JOIN \`${StreetTypeModel.tableName}\` st
      ON si.idStreetType = st.id
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${UserImageModel.tableName}\`
        WHERE isMain = 1
      ) uim
      ON uim.idUserTypeMap = si.idUserTypeMap
      WHERE si.idUserTypeMap = ${req.params.userTypeMapId}`
    );

    if (!saloonInfo.length) {
      return res.status(404).send();
    }

    return res.send(saloonInfo[0]);
  } catch (e) {
    res.status(500).send();
  }
};

const getSaloonBaseServices = async (req, res) => {
  try {
    const ProcedureModel = await Procedure(connection);
    const ServiceModel = await Service(connection);

    const { value, error } = saloonBaseServicesSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { pageNumber, pageSize } = value;
    const offset = pageSize * (pageNumber - 1);

    const total = await ServiceModel.count({ where: { idSaloon: req.params.userTypeMapId } });

    const [services] = total === 0 || offset >= total
      ? [[]]
      : await connection.query(
        `SELECT s.id as id, p.id as procedureId, p.name as procedureName
        FROM \`${ServiceModel.tableName}\` s
        JOIN \`${ProcedureModel.tableName}\` p
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
    const ServiceMasterMapStatusModel = await ServiceMasterMapStatus(connection);
    const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);
    const ServiceMasterMapModel = await ServiceMasterMap(connection);
    const ServiceInstanceModel = await ServiceInstance(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const ProcedureModel = await Procedure(connection);
    const UserImageModel = await UserImage(connection);
    const ServiceModel = await Service(connection);
    const UserModel = await User(connection);

    const date = moment(req.params.date, "DD-MM-YYYY", true);

    if (!date.isValid()) {
      return res.status(400).send("Неверный формат даты.");
    }

    // TODO: не фильтровал по связке салон-мастер. Думаю.
    const [serviceInstancesList] = await connection.query(
      `SELECT si.id as id, p.name as procedureName, si.time as start, s.time as time, smm.idMaster as idMaster
        FROM \`${ServiceInstanceModel.tableName}\` si
        JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
        ON si.idServiceInstanceStatus = sis.id
        JOIN \`${ServiceMasterMapModel.tableName}\` smm
        ON si.idServiceMasterMap = smm.id
        JOIN \`${ServiceMasterMapStatusModel.tableName}\` smms
        ON smm.idServiceMasterMapStatus = smms.id
        JOIN \`${ServiceModel.tableName}\` s
        ON smm.idService = s.id
        JOIN \`${ProcedureModel.tableName}\` p
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
      FROM \`${UserModel.tableName}\` u
      JOIN \`${UserTypeMapModel.tableName}\` utm
      ON u.id = utm.idUser
      LEFT JOIN (
        SELECT idUserTypeMap, url
        FROM \`${UserImageModel.tableName}\`
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
