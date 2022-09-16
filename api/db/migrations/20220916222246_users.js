/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('user_id');
        table.string('first_name', 50);
        table.string('last_name', 50);
        table.string('username', 50).unique().notNullable();
        table.string('password', 500).notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};