'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://cdn.abcotvs.com/dip/images/5488414_082319-wls-hound-mitsuwa-marketplace-11a-vid.jpg?w=1600',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://ramenclub.net/wp-content/uploads/2019/11/IMG_6052-e1573705972490-1024x768.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://www.davisapartmentsforrent.com/fountaincircle/wp-content/uploads/sites/4/2018/01/fountain-circle-pool-area-4.jpg',
        preview: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]:
      ['https://cdn.abcotvs.com/dip/images/5488414_082319-wls-hound-mitsuwa-marketplace-11a-vid.jpg?w=1600',
      'https://ramenclub.net/wp-content/uploads/2019/11/IMG_6052-e1573705972490-1024x768.jpg',
      'https://www.davisapartmentsforrent.com/fountaincircle/wp-content/uploads/sites/4/2018/01/fountain-circle-pool-area-4.jpg']
      }
    }, {});
  }
};
