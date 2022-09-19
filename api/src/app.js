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
  console.log(`servicing GET for /items`);
  knex("items")
    .select("*")
    .then((data) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).send(data);
    });
});

app.get("/items/:itemId", (req, res) => {
  let { itemId } = req.params;
  console.log(`servicing GET for /items/${itemId}`);

  if (!isNaN(parseInt(itemId))) {
    knex("items")
      .join("users", "users.user_id", "=", "items.user_id")
      .select(
        "items.item_id as id",
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

app.get("/items/:username", (req, res) => {
  let { username } = req.params;
  // console.log(params)
  console.log(`servicing GET for /items/${username}`);

  knex("items")
    .join("users", "users.user_id", "=", "items.user_id")
    .select(
      "items.item_id as id",
      "items.name as name",
      "items.description as description",
      "items.quantity as quantity",
      "users.username as created_by"
    )
    .where("users.username", "=", username)
    .then((data) => {
      if (data.length > 0) {
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).send(data);
      } else {
        res.status(404).send();
      }
    });
});

//POST REQ FOR ITEM

//PATCH REQ FOR ITEM

app.patch('/items/:itemId', async (req, res) => {
  let { itemId } = req.params;
  console.log(`servicing PATCH for /items/${itemId}`);
  let body = req.body;
  let validreq = false;

  let keys = ['name', 'description', 'quantity'];

  if (body[keys[0]] || body[keys[1]] || body[keys[2]]) {
    validreq = true;
  }

  if(validreq) {
    knex('items')
      .where('items.id', '=', itemId)
      .update(body, keys)
      .then(() => {
        knex('items')
          .select('*')
          .where('items.id', '=', itemId)
          .then(data => {
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200).json(data);
          })
        })
      } else {
    res.status(404).send()
  }
})

app.delete('/items/:itemId', (req, res) => {
  let { itemId } = req.params;
  console.log(`servicing DELETE for /items/${itemId}`);

  knex('items')
    .where('id', '=', itemId)
    .del()
    .then(data => {
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json(`Number of records deleted: ${data}`)
    })
})

module.exports = app;
