const fs = require("fs");

const { masterUpdatingSchema } = require("../../schemas/masterUpdatingSchema");
const { IMAGE_EXTENSIONS } = require("../../const/registration");
const { connection } = require("../../db/connection");
const { getUserData } = require("../userController");

const updateMaster = async (req, res) => {
  try {
    const {
      master_info,
      user_image,
    } = connection.models;

    const { value, error } = masterUpdatingSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const { description, mainImage } = value;

    await master_info.update(
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

      const masterMainImageInfo = await user_image.findOne({
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
        await user_image.update(
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

module.exports = { updateMaster };
