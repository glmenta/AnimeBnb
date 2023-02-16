'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 1,
        startDate: 'January 4 2023',
        endDate: 'January 7 2023'
      },
      {
        spotId: 2,
        userId: 2,
        startDate: 'March 1 2023',
        endDate: 'March 2 2023'
      },
      {
        spotId: 3,
        userId: 3,
        startDate: 'February 3 2023',
        endDate: 'February 14 2023'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
