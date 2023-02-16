'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options,  [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: "California",
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327,
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123,
      },
      {
        ownerId: 2,
        address: "541 Bryant Street",
        city: "Palo Alto",
        state: "California",
        country: "United States of America",
        lat: 40.7645358,
        lng: -12.4730327,
        name: "Ramen Nagi",
        description: "really good ramen",
        price: 10,
      },
      {
        ownerId: 3,
        address: "1213 Alvarado Avenue",
        city: "Davis",
        state: "California",
        country: "United States of America",
        lat: 50.7645358,
        lng: -237.4730327,
        name: "Fountain Circle",
        description: "good ol davis",
        price: 50,
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['App Academy', 'Ramen Nagi', 'Fountain Circle'] }
    }, {});
  }
};
