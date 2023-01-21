'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'firstName', Sequelize.STRING);
    queryInterface.addColumn('Users', 'lastName', Sequelize.STRING);
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Person', 'firstName');
    queryInterface.removeColumn('Person', 'lastName');
  }
};
