const fs = require("fs");

const { clientHistorySchema } = require("../../schemas/clientHistorySchema");
const { clientUpdatingSchema } = require("../../schemas/clientUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { getUserData } = require("../userController");
const { roles } = require("../../db/consts/roles");
const { connection } = require("../../db/connection");
const UserType = require("../../db/models/UserType");
const UserImage = require("../../db/models/UserImage");
const ClientInfo = require("../../db/models/ClientInfo");
const UserTypeMap = require("../../db/models/UserTypeMap");
const ServiceInstance = require("../../db/models/ServiceInstance");
const ServiceMasterMap = require("../../db/models/ServiceMasterMap");
const Service = require("../../db/models/Service");
const Procedure = require("../../db/models/Procedure");
const SaloonInfo = require("../../db/models/SaloonInfo");
const User = require("../../db/models/User");
const ServiceInstanceStatus = require("../../db/models/ServiceInstanceStatus");

const updateClient = async (req, res) => {
  try {
    const ClientInfoModel = await ClientInfo(connection);
    const UserTypeModel = await UserType(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserImageModel = await UserImage(connection);

    const { dataValues: clientUserTypeData } = await UserTypeModel.findOne({
      where: {
        name: roles.client.name,
      },
    });

    const userTypeMap = await UserTypeMapModel.findOne({
      where: {
        id: req.params.userTypeMapId,
        idUserType: clientUserTypeData.id,
      },
    });

    if (!userTypeMap) {
      return res.status(400).send("Пользователь не найден.");
    }

    const { value, error } = clientUpdatingSchema.validate(req.body);

    if (error)
      return res.status(400).send("Проверьте правильность введённых данных");

    const { lastName, mainImage } = value;

    await ClientInfoModel.update(
      { lastName },
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

      const clientMainImageInfo = await UserImageModel.findOne({
        where: { idUserTypeMap: +req.params.userTypeMapId, isMain: true },
      });

      const dirName = "/userUploads/" + req.params.userTypeMapId + "/images/";
      const fullDirName = "public" + dirName;
      const imageName = dirName + fileName;
      const fullImageName = "public" + imageName;

      if (!fs.existsSync(fullDirName)) {
        fs.mkdirSync(fullDirName, { recursive: true });
      }

      if (clientMainImageInfo && clientMainImageInfo.dataValues) {
        const oldImageFullName = "public" + clientMainImageInfo.dataValues.url;

        if (fs.existsSync(oldImageFullName)) {
          fs.unlinkSync(oldImageFullName);
        }
      }

      let buff = new Buffer.from(data.split(",")[1], "base64");
      fs.writeFileSync(fullImageName, buff);

      if (clientMainImageInfo && clientMainImageInfo.dataValues) {
        await UserImageModel.update(
          {
            url: imageName,
          },
          {
            where: {
              id: clientMainImageInfo.dataValues.id,
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

const clientHistory = async (req, res) => {
  const UserModel = await User(connection);
  const ServiceModel = await Service(connection);
  const ProcedureModel = await Procedure(connection);
  const UserImageModel = await UserImage(connection);
  const SaloonInfoModel = await SaloonInfo(connection);
  const UserTypeMapModel = await UserTypeMap(connection);
  const ServiceInstanceModel = await ServiceInstance(connection);
  const ServiceMasterMapModel = await ServiceMasterMap(connection);
  const ServiceInstanceStatusModel = await ServiceInstanceStatus(connection);

  try {
    const { value, error } = clientHistorySchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { pageNumber, pageSize } = value;

    const [[{ total }]] = await connection.query(
      `SELECT COUNT(DISTINCT si.id) as total
      FROM \`${ServiceInstanceModel.tableName}\` si
      WHERE si.idClient = ${req.params.userTypeMapId}`
    );

    const offset = pageSize * (pageNumber - 1);

    const [data] =
      total === 0 || offset >= total
        ? [[]]
        : await connection.query(
          `SELECT si.id as id, si.time as date, p.name as procedureName, saloon.name as saloonName, saloon_image.url as saloonImage, u.name as masterName, master_image.url as masterImage, sis.name as statusName
          FROM \`${ServiceInstanceModel.tableName}\` si
          JOIN \`${ServiceMasterMapModel.tableName}\` smm
          ON si.idServiceMasterMap = smm.id
          JOIN \`${ServiceModel.tableName}\` s
          ON smm.idService = s.id
          JOIN \`${ProcedureModel.tableName}\` p
          ON s.idProcedure = p.id
          JOIN \`${SaloonInfoModel.tableName}\` saloon
          ON s.idSaloon = saloon.idUserTypeMap
          JOIN \`${UserTypeMapModel.tableName}\` utm
          ON smm.idMaster = utm.id
          JOIN \`${UserModel.tableName}\` u
          ON utm.idUser = u.id
          JOIN \`${ServiceInstanceStatusModel.tableName}\` sis
          ON si.idServiceInstanceStatus = sis.id
          LEFT JOIN (
            SELECT idUserTypeMap, url
            FROM \`${UserImageModel.tableName}\`
            WHERE isMain = 1
          ) master_image
          ON smm.idMaster = master_image.idUserTypeMap
          LEFT JOIN (
            SELECT idUserTypeMap, url
            FROM \`${UserImageModel.tableName}\`
            WHERE isMain = 1
          ) saloon_image
          ON s.idSaloon = saloon_image.idUserTypeMap
          WHERE si.idClient = ${req.params.userTypeMapId}
          ORDER BY si.time DESC
          LIMIT ${pageSize}
          OFFSET ${offset}`
        );

    res.send({
      data,
      total,
    });
  } catch (e) {
    res.status(500).send();
  }
}

module.exports = {
  updateClient,
  clientHistory,
};
