const { connection } = require("../../db/connection");
const User = require("../../db/models/User");
const UserImage = require("../../db/models/UserImage");
const UserStatus = require("../../db/models/UserStatus");
const UserType = require("../../db/models/UserType");
const UserTypeMap = require("../../db/models/UserTypeMap");
const { verifyToken } = require("../../utils/jwt");

const getUserData = async (req, res) => {
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

  console.log("userBaseInfo");
  console.log(userBaseInfo[0][0]);

  const images = await UserImageModel.findAll({
    where: { idUserTypeMap: userTypeMapId },
  });

  let imagesInfo = {
    mainImage: null,
    gallery: [],
  };

  if (images.length) {
    const mappedImages = images.map(({ dataValues }) => dataValues);
    url;
    isMain;
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

  return res.send({ ...userBaseInfo[0][0], ...imagesInfo });
};

module.exports = { getUserData };
