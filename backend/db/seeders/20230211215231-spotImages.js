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
        url: 'https://imgcp.aacdn.jp/img-a/1720/auto/global-aaj-front/article/2016/08/57bdcc9f0d5fc_57bdcc8e0c067_930312360.jpg',
        preview: true
      },
      {
        spotId: 2,
        url: 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2022/10/Gotei_13_Captains.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: 'https://staticg.sportskeeda.com/editor/2022/03/37539-16460998057017-1920.jpg',
        preview: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1,2,3]
      }
    }, {});
  }
};
