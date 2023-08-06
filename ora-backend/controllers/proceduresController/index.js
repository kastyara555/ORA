const { connection } = require("../../db/connection");
const ProcedureGroup = require("../../db/models/ProcedureGroup");

const getProcedureGroups = async (res) => {
    const categories = await ProcedureGroup(connection).findAll();

    res.send(categories);
};

module.exports = {
    getProcedureGroups,
}
