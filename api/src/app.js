const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const bcrypt = require("bcryptjs");

app.use(bodyParser.json());
app.use(cors());

const env = process.env.NODE_ENV || "development";
const config = require("../knexfile")[env];
const knex = require("knex")(config);

app.get("/", (req, res) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.status(200).send("App root route running");
});

// GET all items
app.get("/items", (req, res) => {
  console.log(`servicing GET for /items`);
  knex("items")
    .select("*")
    .then((data) => {
      console.log(data);
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).send(data);
    });
});

// GET item by id
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
        "users.username as username"
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

// GET items from userid
app.get("/items/users/:user_id", (req, res) => {
  let { user_id } = req.params;
  console.log(`servicing GET for /items/users/${user_id}`);

  knex("items")
    .join("users", "users.user_id", "=", "items.user_id")
    .select(
      "items.item_id as item_id",
      "items.name as name",
      "items.description as description",
      "items.quantity as quantity"
    )
    .where("users.user_id", "=", user_id)
    .then((data) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).send(data);
    });
});

// POST for new item
app.post("/items", async (req, res) => {
  console.log(`servicing POST for /items`);
  let body = req.body;
  let validreq = false;
  let validUser = false;
  let user_id = body.user_id;
  let keys = ["user_id", "name", "description", "quantity"];

  if (body[keys[0]] && body[keys[1]] && body[keys[2]] && body[keys[3]]) {
    console.log(`valid request, user_id: ${user_id}`);
    validreq = true;
  } else {
    console.log(`invalid request, user_id: ${user_id}`);
  }

  if (user_id > 0) {
    await knex("users")
      .select("*")
      .where("users.user_id", "=", user_id)
      .then((data) => {
        if (data.length > 0) {
          console.log("valid user");
          validUser = true;
        } else {
          console.log("invalid user");
          validUser = false;
        }
      });
  }

  let filteredBody = {
    user_id: body.user_id,
    name: body.name,
    description: body.description,
    quantity: body.quantity,
  };

  if (validUser && validreq) {
    knex("items")
      .returning(["item_id", "name", "description", "user_id", "quantity"])
      .insert(filteredBody)
      .then((data) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).json(data);
      });
  } else {
    res.status(404).send();
  }
});

// PATCH to update item by id
app.patch("/items/:itemId", async (req, res) => {
  let { itemId } = req.params;
  console.log(`servicing PATCH for /items/${itemId}`);
  let body = req.body;
  let validreq = false;

  let keys = ["name", "description", "quantity"];

  console.log(body[keys[0]])

  if (body[keys[0]] || body[keys[1]] || body[keys[2]]) {
    validreq = true;
  }

  if (validreq) {
    knex("items")
      .where("items.item_id", "=", itemId)
      .update(body, keys)
      .then(() => {
        knex("items")
          .select("*")
          .where("items.item_id", "=", itemId)
          .then((data) => {
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200).json(data);
          });
      });
  } else {
    res.status(404).send();
  }
});

// DELETE for an item by id
app.delete("/items/:itemId", (req, res) => {
  let { itemId } = req.params;
  console.log(`servicing DELETE for /items/${itemId}`);

  knex("items")
    .where("item_id", "=", itemId)
    .del()
    .then((data) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.status(200).json(`Number of records deleted: ${data}`);
    });
});

/*

    USER ENDPOINTS

*/

// register new user
app.post("/users", async (req, res) => {
  console.log(`servicing POST for /users`);

  let body = req.body;
  let validreq = false;
  let validUsername = false;
  let filteredBody = {};
  let passwordHash;
  let usernamePromise;
  let salt = bcrypt.genSaltSync(10);

  let keys = ["first_name", "last_name", "username", "password"];

  if (body[keys[0]] && body[keys[1]] && body[keys[2]] && body[keys[3]]) {
    validreq = true;
    passwordHash = bcrypt.hashSync(body.password, salt);
    filteredBody = {
      first_name: body[keys[0]],
      last_name: body[keys[1]],
      username: body[keys[2]],
      password: passwordHash,
    };
    usernamePromise = knex("users")
      .where("username", "=", body.username)
      .select("*")
      .then((data) => {
        if (data.length > 0) {
          validUsername = false;
        } else {
          validUsername = true;
        }
      });
  }
  await Promise.all([passwordHash, usernamePromise]);
  if (validreq && validUsername) {
    console.log("valid account details");
    knex("users")
      .returning(["user_id", "first_name", "last_name", "username"])
      .insert(filteredBody)
      .then((data) => {
        res.set("Access-Control-Allow-Origin", "*");
        console.log(data);
        res.status(200).send(data);
      });
  } else if (!validUsername) {
    res.status(404).send("username is taken");
  } else {
    res.status(400).send("invalid request");
  }
});

// login
app.post("/login", async (req, res) => {
  console.log(`servicing POST for /login`);

  let body = req.body;
  let validreq = false;
  let keys = ["username", "password"];

  if (body[keys[0]] && body[keys[1]]) {
    validreq = true;
  }

  if (validreq) {
    knex("users")
      .where("users.username", "=", body.username)
      .select("password")
      .then((data) => {
        if (data.length > 0) {
          bcrypt.compare(body.password, data[0].password).then((results) => {
            if (results) {
              console.log("login success");
              res.set("Access-Control-Allow-Origin", "*");
              res.status(200).send("authenticated");
            } else {
              res.set("Access-Control-Allow-Origin", "*");
              res.status(400).send("invalid password");
            }
          });
        } else {
          res.status(404).send("invalid username");
        }
      });
  } else {
    res.status(404).send("invalid request");
  }
});

// get user info
app.get("/users/:username", (req, res) => {
  let { username } = req.params;
  console.log(`servicing GET for /users/${username}`);
  knex("users")
    .where("username", "=", username)
    .select("user_id", "first_name", "last_name", "username")
    .then((data) => {
      if (data.length > 0) {
        res.set("Access-Control-Allow-Origin", "*");
        res.status(200).send(data);
      } else {
        res.status(404).send();
      }
    });
});

module.exports = app;
