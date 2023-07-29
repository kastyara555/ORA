const { connection } = require("../connection");

const ProcedureGroup = require("../models/ProcedureGroup");
const Procedure = require("../models/Procedure");
const City = require("../models/City");
const ClientStatus = require("../models/ClientStatus");
const MasterStatus = require("../models/MasterStatus");
const SaloonStatus = require("../models/SaloonStatus");
const ReviewStatus = require("../models/ReviewStatus");
const ServiceInstanceStatus = require("../models/ServiceInstanceStatus");
const Client = require("../models/Client");
const Master = require("../models/Master");
const Saloon = require("../models/Saloon");
const Review = require("../models/Review");
const Service = require("../models/Service");
const ServiceInstance = require("../models/ServiceInstance");
const ClientCity = require("../models/ClientCity");

const migration = async () => {
  try {
    await connection.authenticate();
    console.log("Connection has been established successfully.");

    await City(connection).sync();
    await ClientStatus(connection).sync();
    await MasterStatus(connection).sync();
    await SaloonStatus(connection).sync();
    await ReviewStatus(connection).sync();
    await ServiceInstanceStatus(connection).sync();
    await ProcedureGroup(connection).sync();

    await Client(connection).sync();
    await Master(connection).sync();
    await Saloon(connection).sync();
    await Procedure(connection).sync();

    await ClientCity(connection).sync();

    await Service(connection).sync();

    await ServiceInstance(connection).sync();

    await Review(connection).sync();

    await connection.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
