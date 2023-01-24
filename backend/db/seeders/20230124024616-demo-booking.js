'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        startDate: new Date(2021, 10, 19), //"2021-11-19"
        endDate: new Date(2021, 10, 20)
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date(2022, 11, 5),
        endDate: new Date(2022, 11, 8)
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date(2021, 2, 4),
        endDate: new Date(2021, 2, 15)
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
