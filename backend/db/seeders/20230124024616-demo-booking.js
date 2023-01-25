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
        startDate: new Date("11-19-2021"), //"2021-11-19"
        endDate: new Date("11-20-2021")
      },
      {
        spotId: 2,
        userId: 3,
        startDate: new Date("12-3-2022"),
        endDate: new Date("12-8-2022")
      },
      {
        spotId: 3,
        userId: 1,
        startDate: new Date("3-4-2021"),
        endDate: new Date("3-15-2021")
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
