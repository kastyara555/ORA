const { connection } = require("../connection");

const ProcedureGroup = require("../models/ProcedureGroup");
const Procedure = require("../models/Procedure");
const City = require("../models/City");
const UserStatus = require("../models/UserStatus");
const ReviewStatus = require("../models/ReviewStatus");
const ServiceInstanceStatus = require("../models/ServiceInstanceStatus");
const User = require("../models/User");
const Review = require("../models/Review");
const Service = require("../models/Service");
const ServiceInstance = require("../models/ServiceInstance");
const UserCityMap = require("../models/UserCityMap");
const ServiceSexPriceMap = require("../models/ServiceSexPriceMap");
const GroupProcedureMap = require("../models/GroupProcedureMap");
const Sex = require("../models/Sex");
const UserType = require("../models/UserType");
const UserRating = require("../models/UserRating");
const SaloonInfo = require("../models/SaloonInfo");
const ClientInfo = require("../models/ClientInfo");
const SaloonGroupProcedureMap = require("../models/SaloonGroupProcedureMap");
const UserTypeMap = require("../models/UserTypeMap");
const UserImage = require("../models/UserImage");
const MasterInfo = require("../models/MasterInfo");
const SaloonMasterMap = require("../models/SaloonMasterMap");

const migration = async () => {
  try {
    await connection.authenticate();
    console.log("Connection has been established successfully.");

    await Sex(connection).sync();
    await City(connection).sync();
    await UserStatus(connection).sync();
    await ReviewStatus(connection).sync();
    await ServiceInstanceStatus(connection).sync();
    await ProcedureGroup(connection).sync();
    await UserType(connection).sync();

    await User(connection).sync();
    await Procedure(connection).sync();

    await UserTypeMap(connection).sync();
    await SaloonInfo(connection).sync();
    await MasterInfo(connection).sync();
    await ClientInfo(connection).sync();

    await SaloonMasterMap(connection).sync();

    await Service(connection).sync();
    await UserRating(connection).sync();
    await UserCityMap(connection).sync();
    await ServiceSexPriceMap(connection).sync();
    await GroupProcedureMap(connection).sync();
    await SaloonGroupProcedureMap(connection).sync();
    await UserImage(connection).sync();

    await ServiceInstance(connection).sync();

    await Review(connection).sync();

    await connection.close();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

migration();
