/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('items').del()
  await knex('items').insert([
    {item_id: 1, user_id: 1, name: 'Pineapple Pen', description: 'It is what it sounds like.', quantity: 10},
    {item_id: 2, user_id: 2, name: 'Apple Pen', description: 'Like a pineapple pen, but an apple', quantity: 20},
  ]);
};
