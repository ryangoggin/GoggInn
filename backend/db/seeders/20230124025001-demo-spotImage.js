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
        spotId: 2,
        url: "https://static.wikia.nocookie.net/spongebob/images/7/7c/SpongeBobHouseStock.png/revision/latest?cb=20221031053603",
        preview: true
      },
      {
        spotId: 3,
        url: "https://static.wikia.nocookie.net/familyguyfanon/images/3/3c/The_Griffin_House.png/revision/latest?cb=20180405011745",
        preview: true
      },
      {
        spotId: 4,
        url: "https://upload.wikimedia.org/wikipedia/en/c/ca/742_Evergreen_Terrace.png",
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
