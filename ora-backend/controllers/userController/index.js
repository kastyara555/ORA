const fs = require("fs");

const { clientUpdatingSchema } = require("../../schemas/clientUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const { verifyToken } = require("../../utils/jwt");
const ClientInfo = require("../../db/models/ClientInfo");
const Sex = require("../../db/models/Sex");
const User = require("../../db/models/User");
const UserImage = require("../../db/models/UserImage");
const UserStatus = require("../../db/models/UserStatus");
const UserType = require("../../db/models/UserType");
const UserTypeMap = require("../../db/models/UserTypeMap");
const SaloonInfo = require("../../db/models/SaloonInfo");
const City = require("../../db/models/City");

const getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const verifiedToken = verifyToken(token);

    if (!verifiedToken) {
      return res.status(401).send("Пользователь не найден.");
    }

    const { userTypeMapId } = verifiedToken;

    const UserTypeMapModel = await UserTypeMap(connection);
    const UserModel = await User(connection);
    const UserTypeModel = await UserType(connection);
    const UserStatusModel = await UserStatus(connection);
    const UserImageModel = await UserImage(connection);
    const ClientInfoModel = await ClientInfo(connection);
    const SexModel = await Sex(connection);
    const SaloonInfoModel = await SaloonInfo(connection);
    const CityModel = await City(connection);

    const userMapInfo = await UserTypeMapModel.findOne({
      where: { id: userTypeMapId },
    });

    if (!userMapInfo) {
      return res.status(401).send("Пользователь не найден.");
    }

    const userBaseInfo = await connection.query(
      `SELECT userTypeMap.hash as userHash, userTypeMap.bonusCount as bonusCount, userBase.name as name, userBase.email as email, userBase.phone as phone, userType.name as userType, userStatus.name as userStatus
    FROM \`${UserTypeMapModel.tableName}\` userTypeMap
    JOIN \`${UserModel.tableName}\` userBase
    ON userTypeMap.idUser = userBase.id
    JOIN \`${UserTypeModel.tableName}\` userType
    ON userTypeMap.idUserType = userType.id
    JOIN \`${UserStatusModel.tableName}\` userStatus
    ON userTypeMap.idUserStatus = userStatus.id
    WHERE userTypeMap.id = ${userTypeMapId}`
    );

    const images = await UserImageModel.findAll({
      where: { idUserTypeMap: userTypeMapId },
    });

    let imagesInfo = {
      mainImage: null,
      gallery: [],
    };

    if (images.length) {
      const mappedImages = images.map(({ dataValues }) => dataValues);
      const gallery = mappedImages
        .filter(({ isMain }) => !isMain)
        .map(({ url }) => url);

      if (gallery.length) {
        imagesInfo.gallery = gallery;
      }

      const mainImage = mappedImages.find(({ isMain }) => isMain);

      if (mainImage && mainImage.url) {
        imagesInfo.mainImage = mainImage.url;
      }
    }

    let result = {
      userTypeMapId,
      ...userBaseInfo[0][0],
      ...imagesInfo,
    };

    // Данные клиента
    if (result.userType === roles.client.name) {
      const clientInfo = await ClientInfoModel.findOne({
        where: { idUserTypeMap: userTypeMapId },
      });

      const clientSex = await SexModel.findOne({
        where: { id: clientInfo.dataValues.idSex },
      });

      result.lastName = clientInfo.dataValues.lastName;
      result.birthday = clientInfo.dataValues.birthday;
      result.sex = clientSex.dataValues.name;
    }

    // Данные салона
    if (result.userType === roles.saloon.name) {
      const saloonInfo = await SaloonInfoModel.findOne({
        where: { idUserTypeMap: userTypeMapId },
      });

      const {
        name,
        description,
        street,
        building,
        stage,
        office,
        visitPayment,
        workingTime,
        idCity,
      } = saloonInfo;

      result.saloonName = name;
      result.saloonDescription = description;
      result.address =
        street && building && stage && office
          ? {
              street,
              building,
              stage,
              office,
            }
          : null;
      result.visitPayment = visitPayment;
      result.workingTime = workingTime;

      const cityInfo = CityModel.findOne({
        where: { id: idCity },
      });

      result.city = { id: cityInfo.id, name: cityInfo.name };
    }

    return res.send(result);
  } catch (e) {
    res.status(500).send();
  }
};

const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const verifiedToken = verifyToken(token);

    if (!verifiedToken) {
      return res.status(401).send("Пользователь не найден.");
    }

    const { userTypeMapId } = verifiedToken;

    const ClientInfoModel = await ClientInfo(connection);
    const UserTypeModel = await UserType(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserImageModel = await UserImage(connection);

    const userTypeMap = await UserTypeMapModel.findOne({
      where: {
        id: req.params.userTypeMapId,
      },
    });

    if (!userTypeMap) {
      return res.status(400).send("Пользователь не найден.");
    }

    const { dataValues: userType } = await UserTypeModel.findOne({
      where: {
        id: userTypeMap.dataValues.idUserType,
      },
    });

    if (
      userType.name === roles.administrator.name ||
      (userType.name === roles.client.name &&
        +userTypeMapId === +req.params.userTypeMapId)
    ) {
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
          const oldImageFullName =
            "public" + clientMainImageInfo.dataValues.url;

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
    }
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { getUserData, updateProfile };
