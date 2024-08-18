const { Sequelize } = require("sequelize");

const connection = new Sequelize(
  "ora_database",
  "root",
  "12345678",
  {
    host: "localhost",
    dialect: "mysql",
  },
  {
    define: {
      freezeTableName: true,
    },
  }
);

const modelDefiners = [
	require('./models/Sex'),
	require('./models/City'),
	require('./models/UserStatus'),
	require('./models/PasswordRestorationStatus'),
	require('./models/SaloonMasterMapStatus'),
	require('./models/ServiceInstanceStatus'),
	require('./models/ServiceMasterMapStatus'),
	require('./models/StreetType'),
	require('./models/UserType'),
	require('./models/ProcedureGroup'),

	require('./models/User'),
	require('./models/Procedure'),
	require('./models/PasswordRestoration'),

	require('./models/UserTypeMap'),
	require('./models/ClientInfo'),
	require('./models/MasterInfo'),
	require('./models/SaloonInfo'),
	require('./models/SaloonMasterMap'),
	require('./models/Service'),
	require('./models/GroupProcedureMap'),
	require('./models/UserImage'),

	require('./models/Favorites'),
	require('./models/ServiceInstance'),
	require('./models/ServiceMasterMap'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(connection);
}

module.exports = {
    connection,
};
