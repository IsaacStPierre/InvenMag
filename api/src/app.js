const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs");

app.use(cors());

const env = process.env.NODE_ENV || "development";
const config = require("../knexfile")[env];
const knex = require("knex")(config);

app.get("/", (req, res) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.status(200).send("App root route running");
});

app.get("/items", (req, res) => {
  knex("items")
    .select("*")
    .then((data) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).send(data);
    });
});

module.exports = app;
