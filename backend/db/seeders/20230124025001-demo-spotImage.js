'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: "https://rew-online.com/wp-content/uploads/2019/05/90-fifth-avenue-ny-ny.jpg",
        preview: true
      },
      {
        spotId: 1,
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png",
        preview: false
      },
      {
        spotId: 1,
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png",
        preview: false
      },
      {
        spotId: 1,
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png",
        preview: false
      },
      {
        spotId: 1,
        url: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png",
        preview: false
      },
      {
        spotId: 2,
        url: "https://static.wikia.nocookie.net/spongebob/images/7/7c/SpongeBobHouseStock.png",
        preview: true
      },
      {
        spotId: 3,
        url: "https://i.pinimg.com/736x/a4/a1/0f/a4a10f79883bb2ea50222e75adcef03d--house-styles-sweet-home.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://upload.wikimedia.org/wikipedia/en/c/ca/742_Evergreen_Terrace.png",
        preview: true
      },
      {
        spotId: 5,
        url: "https://static.wikia.nocookie.net/regularshowfanon/images/6/6f/The_Park.jpg",
        preview: true
      },
      {
        spotId: 6,
        url: "https://static.wikia.nocookie.net/enfuturama/images/0/0e/The_Luck_of_the_Fryrish_%28Main_Episode%29_-_319.png",
        preview: true
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
