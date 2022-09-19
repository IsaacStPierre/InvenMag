const express = require("express");
const cors = require("cors");
const app = express();
const bcryptjs = require("bcryptjs");

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

app.get("/items/:itemId", (req, res) => {
  let { itemId } = req.params;

  if (!isNaN(parseInt(itemId))) {
    knex("items")
      .join("users", "users.user_id", "=", "items.user_id")
      .select(
        "items.item_id as id",
        "items.user_id as user_id",
        "items.name as name",
        "items.description as description",
        "items.quantity as quantity",
        "users.username as created_by"
      )
      .where("items.item_id", "=", itemId)
      .then((data) => {
        if (data.length > 0) {
          res.set("Access-Control-Allow-Origin", "*");
          res.status(200).send(data);
        } else {
          res.status(404).send("No data found");
        }
      });
  }
});

module.exports = app;
