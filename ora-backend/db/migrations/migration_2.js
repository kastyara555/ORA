const { Op } = require("sequelize");

const { connection } = require("../connection");
const { procedures } = require("../consts/categories");

const migration = async () => {
  try {
    await connection.authenticate();
    console.log("Connection has been established successfully.");

    const {
      group_procedure_map,
      procedure_group,
      procedure,
    } = connection.models;

    for (const { name, categories } of procedures) {
      const addedProcedure = await procedure.create({ name });

      const procedureCategories = await procedure_group.findAll({
        where: {
          name: {
            [Op.or]: categories.map(({ name }) => name),
          },
        },
      });

      for (const { id } of procedureCategories) {
        await group_procedure_map.create({ idProcedureGroup: id, idProcedure: addedProcedure.id });
      }
    }

    await connection.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
