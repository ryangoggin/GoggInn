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
      },
      {
        spotId: 7,
        url: "https://static.trip101.com/paragraph_media/pictures/002/517/775/large/551e6923-0099-4a8a-8782-9f20ebec37ae.jpg",
        preview: true
      },
      {
        spotId: 8,
        url: "https://a0.muscache.com/im/pictures/8daeb070-e9f1-40f1-a0c2-fb90682483d3.jpg",
        preview: true
      },
      {
        spotId: 9,
        url: "https://media.timeout.com/images/105885914/750/422/image.jpg",
        preview: true
      },
      {
        spotId: 10,
        url: "https://a0.muscache.com/im/pictures/98253982/0bb47c17_original.jpg",
        preview: true
      },
      {
        spotId: 11,
        url: "https://a0.muscache.com/im/pictures/995c8c2d-62cb-47cc-8d71-6abb2b108b09.jpg",
        preview: true
      },
      {
        spotId: 12,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-51884901/original/d32dbd11-3165-43fe-8899-1e609136c723.jpeg",
        preview: true
      },
      {
        spotId: 13,
        url: "https://a0.muscache.com/im/pictures/14edfaa8-d69c-4f5c-957b-62e1834f65ec.jpg",
        preview: true
      },
      {
        spotId: 14,
        url: "https://a0.muscache.com/im/pictures/5ca6ca46-2aa7-49bc-8d51-6f80f99bbe08.jpg",
        preview: true
      },
      {
        spotId: 15,
        url: "https://a0.muscache.com/im/pictures/78712698/41c8c5f0_original.jpg",
        preview: true
      },
      {
        spotId: 16,
        url: "https://a0.muscache.com/im/pictures/0e17b4a3-b3f1-452d-bdd8-17f899049ca4.jpg",
        preview: true
      },
      {
        spotId: 17,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-45713009/original/cd1729ff-3f60-4a88-b382-ecf928cb00b1.jpeg",
        preview: true
      },
      {
        spotId: 18,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-49899400/original/44b6c924-e3a7-4f91-aa84-064aef565758.jpeg",
        preview: true
      },
      {
        spotId: 19,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-53687101/original/70785584-6b5c-4403-9c4f-7870bec4306d.jpeg",
        preview: true
      },
      {
        spotId: 20,
        url: "https://a0.muscache.com/im/pictures/ad0ed308-f738-4ad9-9f13-53440b6c2e10.jpg",
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
