const fs = require("fs");

const { clientHistorySchema } = require("../../schemas/clientHistorySchema");
const { clientUpdatingSchema } = require("../../schemas/clientUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { getUserData } = require("../userController");
const { roles } = require("../../db/consts/roles");
const { connection } = require("../../db/connection");

const updateClient = async (req, res) => {
  try {
    const {
      client_info,
      user_type,
      user_type_map,
      user_image,
    } = connection.models;

    const { dataValues: clientUserTypeData } = await user_type.findOne({
      where: {
        name: roles.client.name,
      },
    });

    const userTypeMap = await user_type_map.findOne({
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

    await client_info.update(
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
        !IMAGE_EXTENSIONS.includes(fileName.split(".")[1].toLowerCase())
      ) {
        return res.status(400).send("Неверный формат/размер изображения.");
      }

      const clientMainImageInfo = await user_image.findOne({
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
        await user_image.update(
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

const clientHistory = async (req, res) => {
  const {
    service_instance,
    service_master_map,
    service,
    procedure,
    saloon_info,
    user_type_map,
    user,
    service_instance_status,
    user_image,
  } = connection.models;

  try {
    const { value, error } = clientHistorySchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { pageNumber, pageSize } = value;

    const [[{ total }]] = await connection.query(
      `SELECT COUNT(DISTINCT si.id) as total
      FROM \`${service_instance.tableName}\` si
      WHERE si.idClient = ${req.params.userTypeMapId}`
    );

    const offset = pageSize * (pageNumber - 1);

    const [data] =
      total === 0 || offset >= total
        ? [[]]
        : await connection.query(
          `SELECT si.id as id, si.time as date, p.name as procedureName, saloon.idUserTypeMap as saloonId, saloon.name as saloonName, saloon_image.url as saloonImage, u.name as masterName, master_image.url as masterImage, sis.name as statusName
          FROM \`${service_instance.tableName}\` si
          JOIN \`${service_master_map.tableName}\` smm
          ON si.idServiceMasterMap = smm.id
          JOIN \`${service.tableName}\` s
          ON smm.idService = s.id
          JOIN \`${procedure.tableName}\` p
          ON s.idProcedure = p.id
          JOIN \`${saloon_info.tableName}\` saloon
          ON s.idSaloon = saloon.idUserTypeMap
          JOIN \`${user_type_map.tableName}\` utm
          ON smm.idMaster = utm.id
          JOIN \`${user.tableName}\` u
          ON utm.idUser = u.id
          JOIN \`${service_instance_status.tableName}\` sis
          ON si.idServiceInstanceStatus = sis.id
          LEFT JOIN (
            SELECT idUserTypeMap, url
            FROM \`${user_image.tableName}\`
            WHERE isMain = 1
          ) master_image
          ON smm.idMaster = master_image.idUserTypeMap
          LEFT JOIN (
            SELECT idUserTypeMap, url
            FROM \`${user_image.tableName}\`
            WHERE isMain = 1
          ) saloon_image
          ON s.idSaloon = saloon_image.idUserTypeMap
          WHERE si.idClient = ${req.params.userTypeMapId}
          ORDER BY si.time DESC
          LIMIT ${pageSize}
          OFFSET ${offset}`
        );

    return res.send({
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
