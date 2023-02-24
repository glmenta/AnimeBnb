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
        startDate: new Date ('2023-01-04'),
        endDate: new Date ('2023-01-07')
      },
      {
        spotId: 2,
        userId: 2,
        startDate: new Date ('2024-02-03'),
        endDate: new Date ('2024-02-14')
      },
      {
        spotId: 3,
        userId: 3,
        startDate: new Date ('2023-05-01'),
        endDate: new Date ('2023-05-05')
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
