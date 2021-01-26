const databases = require("./out/src/import").databases;

const request = require("request");

databases.forEach(databaseName => {
  request.put(`http://db:5984/${databaseName}`);
});
