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

const sequelize = connection;

const migration = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const {
      password_restoration_status,
      service_master_map_status,
      saloon_master_map_status,
      service_instance_status,
      procedure_group,
      user_status,
      street_type,
      user_type,
      city,
      sex,
    } = connection.models;

    await city.bulkCreate(cities);
    await sex.bulkCreate(Object.values(sexes));
    await user_type.bulkCreate(Object.values(roles));
    await user_status.bulkCreate(Object.values(userStatuses));
    await procedure_group.bulkCreate(Object.values(categories));
    await street_type.bulkCreate(Object.values(STREET_TYPES));
    await password_restoration_status.bulkCreate(
      Object.values(PASSWORD_RESTORATION_STATUSES)
    );
    await service_instance_status.bulkCreate(
      Object.values(SERVICE_INSTANCE_STATUSES)
    );
    await saloon_master_map_status.bulkCreate(
      Object.values(SALOON_MASTER_MAP_STATUSES)
    );
    await service_master_map_status.bulkCreate(
      Object.values(SERVICES_MASTER_MAP_STATUSES)
    );

    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
