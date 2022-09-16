const bcrypt = require('bcrypt')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
 exports.seed = async function(knex) {
  // Deletes ALL existing entries

  let pw1 = 'password';
  let hashedpw1 = await bcrypt.hash(pw1, 10);

  await knex('users').del()
  await knex('users').insert([
    {user_id: 1, first_name: 'Isaac', last_name: 'St. Pierre', username: 'isaacstpierre', password: hashedpw1},
    {user_id: 2, first_name: 'Walter', last_name: 'White', username: 'walterwhite', password: hashedpw1},
  ]);
};
