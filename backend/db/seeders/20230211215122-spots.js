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
        address: "123 Ichiraku Ramen",
        city: "Hidden Leaf",
        state: "Ninja Town",
        country: "Japan",
        lat: 17.7645358,
        lng: -32.4730231,
        name: "Ichiraku",
        description: "Ramen Spot",
        price: 11,
      },
      {
        ownerId: 2,
        address: "6969 Soul Street",
        city: "Seireitei",
        state: "Soul Society",
        country: "Other Realm",
        lat: 40.7645358,
        lng: 12.4730327,
        name: "Shinigami Headquarters",
        description: "Where the captains meet",
        price: 10000,
      },
      {
        ownerId: 3,
        address: "xxxxxx hidden in an island",
        city: "Unknown somewhere",
        state: "Laugh Tale",
        country: "Grand Line",
        lat: 50.7645358,
        lng: 237.4730327,
        name: "One Piece",
        description: "The Treasure",
        price: 5000000000,
      }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Ichiraku', 'Shinigami Headquarters', 'One Piece'] }
    }, {});
  }
};
