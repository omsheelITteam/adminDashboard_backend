require("dotenv").config();
const { Pool } = require("pg");

const newsDashboard = new Pool({
  user: process.env.PGADMINUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

newsDashboard
  .connect()
  .then(() => console.log(`successfully connected to adminsBlog Database`))
  .catch((err) => console.log(err));

module.exports = newsDashboard;