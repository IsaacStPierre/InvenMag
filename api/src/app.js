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
      console.log(data)
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

// GET items from username
app.get("/items/:username", (req, res) => {
  let { username } = req.params;
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

// POST for new item
app.post("/items/:username", async (req, res) => {
  let { username } = req.params;
  console.log(`servicing POST for /items/${username}`);
  let body = req.body;
  let validreq = false;
  let validUser = false;
  let userId = 0;
  let keys = ['created_by', "name", "description", "quantity"];

  console.log(body[keys[0]])
  console.log(body[keys[1]])
  console.log(body[keys[2]])

  if (body[keys[0]] && body[keys[1]] && body[keys[2]] && body[keys[3]]) {
    console.log("valid request")
    validreq = true;
  } else {
    console.log("invalid request")
  }

  if (username) {
    await knex("users")
      .select("*")
      .where("users.username", "=", username)
      .then((data) => {
        if (data.length > 0) {
          console.log("valid user")
          validUser = true;
          userId = data[0].user_id;
        } else {
          console.log("invalid user")
          validUser = false;
        }
      });
  }

  let filteredBody = {
    name: body.name,
    description: body.description,
    user_id: userId,
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
      .where('items.item_id', '=', itemId)
      .update(body, keys)
      .then(() => {
        knex('items')
          .select('*')
          .where('items.item_id', '=', itemId)
          .then(data => {
            res.set("Access-Control-Allow-Origin", "*");
            res.status(200).json(data);
          })
        })
      } else {
    res.status(404).send()
  }
})

// DELETE for an item by id
app.delete("/items/:itemId", (req, res) => {
  let { itemId } = req.params;
  console.log(`servicing DELETE for /items/${itemId}`);

  knex("items")
    .where("id", "=", itemId)
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
    passwordHash = bcrypt.hashSync(body.password, salt)
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
    console.log("valid account details")
    knex("users")
      .returning(["user_id", "first_name", "last_name", "username"])
      .insert(filteredBody)
      .then((data) => {
        res.set("Access-Control-Allow-Origin", "*");
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

// view user info
app.get("/users/:username", (req, res) => {
  let { username } = req.params;
  console.log(`servicing GET for /users/${username}`);
  if (isNaN(parseInt(username))) {
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
  } else {
    console.log("invalid username");
  }
});

module.exports = app;
