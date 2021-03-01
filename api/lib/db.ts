// Node imports
import * as mongoose from "mongoose";

// Lib imports
import * as console from "./logging";

import { mongo_password, mongo_user } from "../secrets.json";

// https://developer.mongodb.com/community/forums/t/warning-accessing-non-existent-property-mongoerror-of-module-exports-inside-circular-dependency/15411
const db_init = async () => {
  try {
    let mongo_options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(
      `mongodb+srv://${mongo_user}:${mongo_password}@cluster0.11e5c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
      mongo_options
    );
    console.success("Mongo connect successful");
  } catch (error) {
    console.error(error);
  }
};

export { db_init };
