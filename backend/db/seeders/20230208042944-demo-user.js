'use strict';
/** @type {import('sequelize-cli').Migration} */

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    return queryInterface.bulkInsert(options, [
      {
        email: 'naruto@konoha.com',
        username: 'hokage',
        hashedPassword: bcrypt.hashSync('password1'),
        firstName: 'Naruto',
        lastName: 'Uzumaki'
      },
      {
        email: 'ichigo@bleach.com',
        username: 'soulreaper',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Ichigo',
        lastName: 'Kurosaki'
      },
      {
        email: 'luffy@onepiece.com',
        username: 'pirateking',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Luffy',
        lastName: 'Monkey'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['hokage', 'soulreaper', 'pirateking'] }
    }, {});
  }
};
