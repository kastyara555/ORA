const { connection } = require("../../db/connection");
const Procedure = require("../../db/models/Procedure");
const { procedureDataSchema } = require("../../schemas/procedureDataSchema");

const getProcedureData = async (req, res) => {
  try {
    const ProcedureModel = await Procedure(connection);

    const { value, error } = procedureDataSchema.validate(req.body);

    if (error) {
      return res.status(400).send("Проверьте правильность введённых данных");
    }

    const existProcedure = await ProcedureModel.findOne({
      where: { id: req.params.procedureId },
    });

    if (!existProcedure) {
      return res.status(404).send("Процедура не существует.");
    }

    // const date = moment(value.date, "DD-MM-YYYY", true);

    // if (!date.isValid()) {
    //   return res.status(400).send("Неверный формат даты.");
    // }

    // if (!date.isSameOrAfter(moment(), "day")) {
    //   return res
    //     .status(400)
    //     .send(
    //       "Просматривать доступные записи можно только для сегодня и будущих дней."
    //     );
    // }

    res.send({
      procedureName: existProcedure.dataValues.name,
    });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  getProcedureData,
};
