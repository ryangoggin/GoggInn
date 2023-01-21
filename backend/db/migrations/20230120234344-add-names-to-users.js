'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", 'firstName', Sequelize.STRING);
    await queryInterface.addColumn("Users", 'lastName', Sequelize.STRING);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", 'firstName');
    await queryInterface.removeColumn("Users", 'lastName');
  }
};
