const databases = require("./import.js").databases;

const request = require("request");

databases.forEach(databaseName => {
  request.put(`http://localhost:5984/${databaseName}`);
});
