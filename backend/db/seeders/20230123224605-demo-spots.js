'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: "123 Disney Lane",
        city: "San Francisco",
        state: 'California',
        country: "United States of America",
        lat: 37.7645358,
        lng: -122.4730327, //W is negative
        name: "App Academy",
        description: "Place where web developers are created",
        price: 123
      },
      {
        ownerId: 2,
        address: "123 Coral Street",
        city: "Bikini Bottom",
        state: 'Florida',
        country: "United States of America",
        lat: 27.6648358,
        lng: -81.5158327,
        name: "Spongebob's Pineapple",
        description: "Place where Spongebob lives",
        price: 999.62
      },
      {
        ownerId: 3,
        address: "31 Spooner Street",
        city: "Quahog",
        state: 'Rhode Island',
        country: "United States of America",
        lat: 41.5801358,
        lng: -71.4774327,
        name: "Griffin House",
        description: "Place where Peetah Griffin lives",
        price: 50.50
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["App Academy", "Spongebob's Pineapple", "Griffin House"] }
    }, {});
  }
};
