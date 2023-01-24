'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://assets-global.website-files.com/5dcc7f8c449e597ed83356b8/603820afd31232aab368ea6f_New%20Red-logo-emblem.webp"
      },
      {
        reviewId: 2,
        url: "https://img.buzzfeed.com/buzzfeed-static/static/2021-03/9/23/asset/ef450f789392/anigif_sub-buzz-13392-1615333921-2_preview.gif?output-quality=auto&output-format=auto&downsize=360:*"
      },
      {
        reviewId: 3,
        url: "https://i.ytimg.com/vi/zieqD5aa8nM/hqdefault.jpg"
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
