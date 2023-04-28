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
        description: "Place where Spongebob lives, it is underwater in Bikini Bottom",
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
        description: "Place where Peter Griffin lives, it is in Quahog",
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
        description: "Headquarters of Planet Express, it is where the characters in Futurama work",
        price: 295.60
      },
      {
        ownerId: 1,
        address: "21901 County 49",
        city: "Akeley",
        state: "Minnesota",
        country: 'United States of America',
        lat: 45.99536,
        lng: -112.50578,
        name: "Cozy Minnesota Spot",
        description: "Enjoy your stay at this lovely spot",
        price: 85.42
    },
    {
        ownerId: 2,
        address: "17389 Brownsferry Rd",
        city: "Athens",
        state: "Alabama",
        country: 'United States of America',
        lat: 34.77898,
        lng: -87.01568,
        name: "Treehouse in Athens",
        description: "Book your next vacation here, you won't regret it",
        price: 94.78
    },
    {
        ownerId: 3,
        address: "1719 College Street",
        city: "Atlanta",
        state: "Georgia",
        country: 'United States of America',
        lat: 33.849121,
        lng: -84.406921,
        name: "Atlanta House",
        description: "Enjoy your stay at this lovely spot",
        price: 165.55
    },
    {
        ownerId: 1,
        address: "4163 Woodhill Avenue",
        city: "Easton",
        state: "Maryland",
        country: 'United States of America',
        lat: 38.841347,
        lng: -75.990379,
        name: "Quiet Easton Shack",
        description: "Enjoy your stay at this lovely spot",
        price: 77.77
    },
    {
        ownerId: 3,
        address: "3389 Station Street",
        city: "San Jose",
        state: "California",
        country: 'United States of America',
        lat: 37.404716,
        lng: -122.034706,
        name: "South Bay Spot",
        description: "Enjoy your stay at this lovely spot",
        price: 348.90
    },
    {
        ownerId: 2,
        address: "2284 Benson Street",
        city: "Lake Tomahawk",
        state: "Wisconsin",
        country: 'United States of America',
        lat: 45.690887,
        lng: -89.539909,
        name: "Lake House",
        description: "Make your next vacation at this fun spot",
        price: 195.33
    },
    {
        ownerId: 3,
        address: "1360 Roguski Road",
        city: "Natchitoches",
        state: "Louisiana",
        country: 'United States of America',
        lat: 31.700418,
        lng: -93.051628,
        name: "House with Bridge",
        description: "Book your next vacation here, you won't regret it",
        price: 128.54
    },
    {
        ownerId: 1,
        address: "4120 Hamill Avenue",
        city: "San Diego",
        state: "California",
        country: 'United States of America',
        lat: 32.799046,
        lng: -117.234001,
        name: "Sunny San Diego Spot",
        description: "Enjoy your stay at this lovely spot",
        price: 461.14
    },
    {
        ownerId: 2,
        address: "2284 Kessla Way",
        city: "Conway",
        state: "South Carolina",
        country: 'United States of America',
        lat: 33.909843,
        lng: -78.956352,
        name: "Cozy South Carolina Getaway",
        description: "Book your next vacation here, you won't regret it",
        price: 190.32
    },
    {
        ownerId: 3,
        address: "4576 Karen Lane",
        city: "Louisville",
        state: "Kentucky",
        country: 'United States of America',
        lat: 38.105019,
        lng: -85.675758,
        name: "Baseball Fans' Spot",
        description: "Enjoy your stay at this lovely spot",
        price: 99.23
    },
    {
        ownerId: 1,
        address: "2912 Woodside Circle",
        city: "Panama City",
        state: "Florida",
        country: 'United States of America',
        lat: 30.175798,
        lng: -85.599541,
        name: "Sunny House on the Beach",
        description: "Make your next vacation at this fun spot",
        price: 390.85
    },
    {
        ownerId: 2,
        address: "1004 Granville Lane",
        city: "Whippany",
        state: "New Jersey",
        country: 'United States of America',
        lat: 40.904320,
        lng: -74.426888,
        name: "NJ 2 bed, 1 bath",
        description: "Enjoy your stay at this lovely spot",
        price: 128.21
    },
    {
        ownerId: 3,
        address: "1246 Watson Lane",
        city: "Asheville",
        state: "North Carolina",
        country: 'United States of America',
        lat: 35.617004,
        lng: -82.473640,
        name: "Asheville Spot",
        description: "Make your next vacation at this fun spot",
        price: 89.44
    },
    {
        ownerId: 1,
        address: "1707 Farland Street",
        city: "Bolton",
        state: "Massachusetts",
        country: 'United States of America',
        lat: 42.489933,
        lng: -71.653603,
        name: "Bolton Spot (Not Boston!)",
        description: "Make your next vacation at this fun spot",
        price: 173.32
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
