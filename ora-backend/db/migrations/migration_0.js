const { connection } = require("../connection");

const migration = async () => {
  try {
    await connection.authenticate();
    console.log("Connection has been established successfully.");

    const {
      sex,
      city,
      user_status,
      password_restoration_status,
      service_instance_status,
      procedure_group,
      user_type,
      street_type,
      user,
      procedure,
      password_restoration,
      user_type_map,
      saloon_info,
      master_info,
      client_info,
      saloon_master_map_status,
      saloon_master_map,
      service,
      group_procedure_map,
      user_image,
      service_master_map_status,
      service_master_map,
      service_instance,
      favorites,
    } = connection.models;

    await password_restoration_status.sync();
    await service_master_map_status.sync();
    await saloon_master_map_status.sync();
    await service_instance_status.sync();
    await procedure_group.sync();
    await user_status.sync();
    await street_type.sync();
    await user_type.sync();
    await city.sync();
    await sex.sync();

    await password_restoration.sync();
    await procedure.sync();
    await user.sync();

    await user_type_map.sync();
    await saloon_info.sync();
    await master_info.sync();
    await client_info.sync();

    await saloon_master_map.sync();

    await group_procedure_map.sync();
    await user_image.sync();
    await service.sync();

    await service_master_map.sync();
    await service_instance.sync();
    await favorites.sync();

    await connection.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
