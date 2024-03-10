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
const MasterInfo = require("../../db/models/MasterInfo");

const getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const verifiedToken = verifyToken(token);

    const { userTypeMapId } = verifiedToken;

    const UserTypeMapModel = await UserTypeMap(connection);
    const UserModel = await User(connection);
    const UserTypeModel = await UserType(connection);
    const UserStatusModel = await UserStatus(connection);
    const UserImageModel = await UserImage(connection);
    const ClientInfoModel = await ClientInfo(connection);
    const SexModel = await Sex(connection);
    const SaloonInfoModel = await SaloonInfo(connection);
    const MasterInfoModel = await MasterInfo(connection);
    const CityModel = await City(connection);

    const userMapInfo = await UserTypeMapModel.findOne({
      where: { id: userTypeMapId },
    });

    if (!userMapInfo) {
      return res.status(400).send("Пользователь не найден.");
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

      const cityInfo = await CityModel.findOne({
        where: { id: idCity },
      });

      result.city = { id: cityInfo.id, name: cityInfo.name };
    }

    // Данные мастера
    if (result.userType === roles.master.name) {
      const masterInfo = await MasterInfoModel.findOne({
        where: { idUserTypeMap: userTypeMapId },
      });

      const { description } = masterInfo;

      result.masterDescription = description;
    }

    return res.send(result);
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { getUserData };
