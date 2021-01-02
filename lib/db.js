var mysql = require("mysql");
var db = mysql.createConnection({
  host: "localhost",
  user: "gyumin",
  password: "EudaiMonia",
  database: "opentutorials",
});

db.connect(function (err) {
  if (err) {
    console.error("error connecting : " + err.stack);
    return;
  }
});

module.exports = db;
