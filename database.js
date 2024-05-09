const fs = require("fs");
const {Pool} = require("pg");

const config = {
  user: "avnadmin",
  password: "AVNS_wWmpOuV1IyDZM3PIzmA",
  host: "pg-1840963b-ajaykrdtg5-52ec.a.aivencloud.com",
  port: "23155",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("./ca.pem").toString(),
  },
};

const client = new Pool(config);
client.connect(function (err) {
  if (err) throw err;
  
  console.log("connected");
  client.query("SELECT VERSION()", [], function (err, result) {
    if (err) throw err;

    console.log(result.rows[0]);
    client.end(function (err) {
      if (err) throw err;
    });
  });
});