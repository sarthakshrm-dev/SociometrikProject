require('dotenv').config();
const pgp = require('pg-promise')({
  noWarnings: true,
});

const username = process.env.DB_USER;
const password = process.env.DB_PASS;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB;
const db = pgp(
  `postgres://${username}:${password}@${host}:${port}/${database}`
);

module.exports = db;
