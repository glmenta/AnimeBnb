'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        userId: 1,
        spotId: 1,
        review: 'Pretty amazing ramen',
        stars: 4,
      },
      {
        userId: 2,
        spotId: 2,
        review: 'The captains were too loud arguing and the spiritual pressure kept me awake',
        stars: 2,
      },
      {
        userId: 3,
        spotId: 3,
        review: 'I know now about the truth of the world',
        stars: 5,
      }
    ], {});

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['I learned stuff', 'I ate rly good but they forgot my karaage', 'I paid too much for this'] }
    }, {});
  }
};
