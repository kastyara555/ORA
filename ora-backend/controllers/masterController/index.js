const fs = require("fs");

const { masterUpdatingSchema } = require("../../schemas/masterUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { connection } = require("../../db/connection");
const { roles } = require("../../db/consts/roles");
const UserImage = require("../../db/models/UserImage");
const UserType = require("../../db/models/UserType");
const UserTypeMap = require("../../db/models/UserTypeMap");
const MasterInfo = require("../../db/models/MasterInfo");
const { getUserData } = require("../userController");

const updateMaster = async (req, res) => {
  try {
    const MasterInfoModel = await MasterInfo(connection);
    const UserTypeModel = await UserType(connection);
    const UserTypeMapModel = await UserTypeMap(connection);
    const UserImageModel = await UserImage(connection);

    const { dataValues: masterUserTypeData } = await UserTypeModel.findOne({
      where: {
        name: roles.master.name,
      },
    });

    const userTypeMap = await UserTypeMapModel.findOne({
      where: {
        id: req.params.userTypeMapId,
        idUserType: masterUserTypeData.id,
      },
    });

    if (!userTypeMap) {
      return res.status(400).send("Пользователь не найден.");
    }

    const { value, error } = masterUpdatingSchema.validate(req.body);

    if (error)
      return res.status(400).send("Проверьте правильность введённых данных");

    const { description, mainImage } = value;

    await MasterInfoModel.update(
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

      const masterMainImageInfo = await UserImageModel.findOne({
        where: { idUserTypeMap: +req.params.userTypeMapId, isMain: true },
      });

      const dirName = "/userUploads/" + req.params.userTypeMapId + "/images/";
      const fullDirName = "public" + dirName;
      const imageName = dirName + fileName;
      const fullImageName = "public" + imageName;

      if (!fs.existsSync(fullDirName)) {
        fs.mkdirSync(fullDirName, { recursive: true });
      }

      if (masterMainImageInfo && masterMainImageInfo.dataValues) {
        const oldImageFullName = "public" + masterMainImageInfo.dataValues.url;

        if (fs.existsSync(oldImageFullName)) {
          fs.unlinkSync(oldImageFullName);
        }
      }

      let buff = new Buffer.from(data.split(",")[1], "base64");
      fs.writeFileSync(fullImageName, buff);

      if (masterMainImageInfo && masterMainImageInfo.dataValues) {
        await UserImageModel.update(
          {
            url: imageName,
          },
          {
            where: {
              id: masterMainImageInfo.dataValues.id,
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

module.exports = { updateMaster };
