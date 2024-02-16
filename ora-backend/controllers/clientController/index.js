const fs = require("fs");

const { clientUpdatingSchema } = require("../../schemas/clientUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const ClientInfo = require("../../db/models/ClientInfo");
const UserImage = require("../../db/models/UserImage");
const UserType = require("../../db/models/UserType");
const UserTypeMap = require("../../db/models/UserTypeMap");
const { getUserData } = require("../userController");

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

module.exports = { updateClient };
