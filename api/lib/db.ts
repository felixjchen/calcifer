// Node imports
import * as mongoose from "mongoose";
import * as models from "./models";

import {
  mongo_password,
  mongo_user,
  mongo_database,
  mongo_uri,
  mongo_protocol,
} from "../_config";

// https://developer.mongodb.com/community/forums/t/warning-accessing-non-existent-property-mongoerror-of-module-exports-inside-circular-dependency/15411
const db_init = async () => {
  // Connect
  try {
    let mongo_options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(
      `${mongo_protocol}://${mongo_user}:${mongo_password}@${mongo_uri}/${mongo_database}?retryWrites=true&w=majority`,
      mongo_options
    );
    console.log(`connected to MongoDB`);
  } catch (error) {
    console.error(error);
  }

  // Clear db on startup
  await models.Playgrounds.deleteMany({});
  console.log("reset mongo");
  // Return models
  return models;
};

export { db_init };
