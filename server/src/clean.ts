import * as request from "request-promise-native";

import { databases } from "./constants";

databases.forEach(database => {
  request.del(`http://db:5984/${database}`);
});
