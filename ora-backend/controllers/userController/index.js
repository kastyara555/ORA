const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const { verifyToken } = require("../../utils/jwt");

const getUserData = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const verifiedToken = verifyToken(token);

    const { userTypeMapId } = verifiedToken;

    const {
      user_type_map,
      user_status,
      client_info,
      saloon_info,
      master_info,
      street_type,
      user_image,
      user_type,
      city,
      user,
      sex,
    } = connection.models;

    const userMapInfo = await user_type_map.findOne({
      where: { id: userTypeMapId },
    });

    if (!userMapInfo) {
      return res.status(400).send("Пользователь не найден.");
    }

    const userBaseInfo = await connection.query(
      `SELECT userTypeMap.hash as userHash, userTypeMap.bonusCount as bonusCount, userBase.name as name, userBase.email as email, userBase.phone as phone, userType.name as userType, userStatus.name as userStatus
    FROM \`${user_type_map.tableName}\` userTypeMap
    JOIN \`${user.tableName}\` userBase
    ON userTypeMap.idUser = userBase.id
    JOIN \`${user_type.tableName}\` userType
    ON userTypeMap.idUserType = userType.id
    JOIN \`${user_status.tableName}\` userStatus
    ON userTypeMap.idUserStatus = userStatus.id
    WHERE userTypeMap.id = ${userTypeMapId}`
    );

    const images = await user_image.findAll({
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
      const clientInfo = await client_info.findOne({
        where: { idUserTypeMap: userTypeMapId },
      });

      const clientSex = await sex.findOne({
        where: { id: clientInfo.dataValues.idSex },
      });

      result.lastName = clientInfo.dataValues.lastName;
      result.birthday = clientInfo.dataValues.birthday;
      result.sex = clientSex.dataValues.name;
    }

    // Данные салона
    if (result.userType === roles.saloon.name) {
      const saloonInfo = await saloon_info.findOne({
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
        idStreetType,
      } = saloonInfo;

      result.saloonName = name;
      result.saloonDescription = description;

      const streetTypeInfo = idStreetType ? await street_type.findOne({
        where: { id: idStreetType },
      }) : null;

      result.address =
        street && building && stage && office && streetTypeInfo
          ? {
            street,
            building,
            stage,
            office,
            streetType: streetTypeInfo ? { id: streetTypeInfo.dataValues.id, name: streetTypeInfo.dataValues.name } : null,
          }
          : null;
      result.visitPayment = visitPayment;
      result.workingTime = workingTime;

      const cityInfo = await city.findOne({
        where: { id: idCity },
      });

      result.city = { id: cityInfo.id, name: cityInfo.name };
    }

    // Данные мастера
    if (result.userType === roles.master.name) {
      const masterInfo = await master_info.findOne({
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
