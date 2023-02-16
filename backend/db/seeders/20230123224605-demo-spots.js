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
        price: 123.00
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
        description: "Place where Spongebob lives, it is underwater in Bikin Bottom",
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
        description: "Place where Peetah Griffin lives, it is in Quahog",
        price: 150.50
      },
      {
        ownerId: 1,
        address: "743 Evergreen Terrace",
        city: "Springfield",
        state: 'Illinois',
        country: "United States of America",
        lat: 39.7817358,
        lng: -89.6501327,
        name: "Simpsons House",
        description: "Place where The Simpsons live, it is in Springfield",
        price: 160.75
      },
      {
        ownerId: 2,
        address: "Park AV 300",
        city: "East Pines",
        state: 'Colorado',
        country: "United States of America",
        lat: 39.5501123,
        lng: -105.7821392,
        name: "The Park",
        description: "Place where Mordecai and Rigby live, it is in The Park",
        price: 183.83
      },
      {
        ownerId: 3,
        address: "West 57th Street",
        city: "Manhattan",
        state: 'New New York',
        country: "United States of America",
        lat: 40.7831752,
        lng: -73.9712058,
        name: "Planet Express",
        description: "Headquarters of Planet Express, it is where ppl in Futurama work",
        price: 295.60
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
