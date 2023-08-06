const { Op } = require("sequelize");

const { connection } = require("../connection");
const { procedures } = require("../consts/categories");
const ProcedureGroup = require("../models/ProcedureGroup");
const Procedure = require("../models/Procedure");
const GroupProcedureMap = require("../models/GroupProcedureMap");

const sequelize = connection;

const migration = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const ProcedureModel = await Procedure(sequelize);
    const ProcedureGroupModel = await ProcedureGroup(sequelize);
    const GroupProcedureMapModel = await GroupProcedureMap(sequelize);

    for (const { name, categories } of procedures) {
      const addedProcedure = await ProcedureModel.create({ name });

      const procedureCategories = await ProcedureGroupModel.findAll({
        where: {
          name: {
            [Op.or]: categories.map(({ name }) => name),
          },
        },
      });

      for (const { id } of procedureCategories) {
        await GroupProcedureMapModel.create({ idProcedureGroup: id, idProcedure: addedProcedure.id });
      }
    }

    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
