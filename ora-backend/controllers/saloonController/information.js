const fs = require("fs");

const { saloonUpdatingSchema } = require("../../schemas/saloonUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { connection } = require("../../db/connection");
const UserImage = require("../../db/models/UserImage");
const SaloonInfo = require("../../db/models/SaloonInfo");
const City = require("../../db/models/City");
const { getUserData } = require("../userController");

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
    const UserImageModel = await UserImage(connection);
    const CityModel = await City(connection);

    const [saloonInfo] = await connection.query(
      `SELECT si.idUserTypeMap as id,si.name as name, si.description as description, si.workingTime as workingTime, c.name as cityName, uim.url as mainImage
      FROM \`${SaloonInfoModel.tableName}\` si
      JOIN \`${CityModel.tableName}\` c
      ON si.idCity = c.id
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

    res.send(saloonInfo[0]);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { updateSaloon, getSaloonBaseInfo };
