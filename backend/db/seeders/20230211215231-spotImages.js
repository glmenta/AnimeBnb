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
      },
      {
        spotId: 4,
        url: 'https://longreads.com/wp-content/uploads/2017/10/8d6f474fda2c0df0f47b8ad4793f1390.jpg',
        preview: true
      },
      {
        spotId: 5,
        url: "https://cdna.artstation.com/p/assets/images/images/034/603/768/large/collin-cantrell-untitled.jpg?1612739307",
        preview: true
      },
      {
        spotId: 6,
        url: "https://img.anime2you.de/2021/01/aot-city.jpg",
        preview: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1,2,3,4,5,6]
      }
    }, {});
  }
};
