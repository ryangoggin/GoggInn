'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        review: "It is a place",
        stars: 4
      },
      {
        spotId: 2,
        userId: 3,
        review: "There was a door",
        stars: 5
      },
      {
        spotId: 3,
        userId: 1,
        review: "It had windows",
        stars: 3
      },
      {
        spotId: 4,
        userId: 2,
        review: "There were donuts",
        stars: 4
      },
      {
        spotId: 7,
        userId: 2,
        review: "Odd house shape... was alright",
        stars: 3
      },
      {
        spotId: 8,
        userId: 1,
        review: "This place was so cool, would recommend!",
        stars: 5
      },
      {
        spotId: 9,
        userId: 2,
        review: "The pool was so nice, will definitely be coming back",
        stars: 5
      },
      {
        spotId: 11,
        userId: 1,
        review: "Owner's car took up the driveway the whole time...",
        stars: 3
      },
      {
        spotId: 12,
        userId: 3,
        review: "Was so pretty and clean",
        stars: 5
      },
      {
        spotId: 14,
        userId: 3,
        review: "There weren't any chairs by the pool, but awesome otherwise",
        stars: 4
      },
      {
        spotId: 15,
        userId: 1,
        review: "If by cozy you mean cramped, then yes",
        stars: 2
      },
      {
        spotId: 16,
        userId: 2,
        review: "Close to the Lousiville Slugger Museum, but brick walls were weird",
        stars: 4
      },
      {
        spotId: 17,
        userId: 2,
        review: "Fantastic vacation spot for spring break",
        stars: 5
      },
      {
        spotId: 20,
        userId: 2,
        review: "I thought it said Boston when I booked, whoops",
        stars: 4
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
