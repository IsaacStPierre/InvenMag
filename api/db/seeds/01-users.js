const bcrypt = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync("password", salt);

  await knex("items").del();
  await knex("users").del();
  await knex("users").insert([
    {
      user_id: 1,
      first_name: "Isaac",
      last_name: "St. Pierre",
      username: "isaacstpierre",
      password: hash,
    },
    {
      user_id: 2,
      first_name: "Walter",
      last_name: "White",
      username: "walterwhite",
      password: hash,
    },
  ]);
};
