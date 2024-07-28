const { connection } = require("../connection");
const { cities } = require("../consts/cities");
const { roles } = require("../consts/roles");
const { categories } = require("../consts/categories");
const { sexes } = require("../consts/sexes");
const { userStatuses } = require("../consts/userStatuses");
const { STREET_TYPES } = require("../consts/streetTypes");
const {
  PASSWORD_RESTORATION_STATUSES,
} = require("../consts/passwordRestorationStatuses");
const { SERVICE_INSTANCE_STATUSES } = require("../consts/serviceInstanceStatuses");
const { SALOON_MASTER_MAP_STATUSES } = require("../consts/saloonMasterMapStatuses");
const { SERVICES_MASTER_MAP_STATUSES } = require("../consts/serviceMasterMapStatuses");
const City = require("../models/City");
const Sex = require("../models/Sex");
const UserType = require("../models/UserType");
const UserStatus = require("../models/UserStatus");
const ProcedureGroup = require("../models/ProcedureGroup");
const StreetType = require("../models/StreetType");
const PasswordRestorationStatus = require("../models/PasswordRestorationStatus");
const ServiceInstanceStatus = require("../models/ServiceInstanceStatus");
const SaloonMasterMapStatus = require("../models/SaloonMasterMapStatus");
const ServiceMasterMapStatus = require("../models/ServiceMasterMapStatus");

const sequelize = connection;

const migration = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await City(connection).bulkCreate(cities);
    await Sex(connection).bulkCreate(Object.values(sexes));
    await UserType(connection).bulkCreate(Object.values(roles));
    await UserStatus(connection).bulkCreate(Object.values(userStatuses));
    await ProcedureGroup(connection).bulkCreate(Object.values(categories));
    await StreetType(connection).bulkCreate(Object.values(STREET_TYPES));
    await PasswordRestorationStatus(connection).bulkCreate(
      Object.values(PASSWORD_RESTORATION_STATUSES)
    );
    await ServiceInstanceStatus(connection).bulkCreate(
      Object.values(SERVICE_INSTANCE_STATUSES)
    );
    await SaloonMasterMapStatus(connection).bulkCreate(
      Object.values(SALOON_MASTER_MAP_STATUSES)
    );
    await ServiceMasterMapStatus(connection).bulkCreate(
      Object.values(SERVICES_MASTER_MAP_STATUSES)
    );

    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
