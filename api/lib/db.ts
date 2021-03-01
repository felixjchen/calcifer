// Node imports
import * as mongoose from "mongoose";
import * as models from "./models";

import { mongo_password, mongo_user, mongo_database } from "../config";

// https://developer.mongodb.com/community/forums/t/warning-accessing-non-existent-property-mongoerror-of-module-exports-inside-circular-dependency/15411
const db_init = async () => {
  // Connect
  try {
    let mongo_options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(
      `mongodb+srv://${mongo_user}:${mongo_password}@cluster0.11e5c.mongodb.net/${mongo_database}?retryWrites=true&w=majority`,
      mongo_options
    );
    console.log(`mongo connect successful`);
  } catch (error) {
    console.error(error);
  }

  // Return models
  return models;
};

export { db_init };
