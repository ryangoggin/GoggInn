'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // One user to many spots association
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      });

      // One spot to many spotImages association
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });

      // One spot to many reviews association
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });

      // One spot to many bookings association
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull:false,
      unique: true,
      validate: {
        isAddress(value) {
          let addressArr = value.split(" ");
          let addressNum = parseInt(addressArr[0]);
          if (Number.isNaN(addressNum)) {
            throw new Error("Address must start with a number.");
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 105], // for some reason there are 1 letter long places and there's a 105 letter long place
        noNums(value) {
          for (let i = 0; i < value.length; i++) {
            if (Number.isInteger(value[i])) {
              throw new Error("City cannot have a number in it")
            }
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 105],
        noNums(value) {
          for (let i = 0; i < value.length; i++) {
            if (Number.isInteger(value[i])) {
              throw new Error("State cannot have a number in it")
            }
          }
        }
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 56], //shortest country names are 3 letters, longest country name is 56 letters long
        noNums(value) {
          for (let i = 0; i < value.length; i++) {
            if (Number.isInteger(value[i])) {
              throw new Error("Country cannot have a number in it")
            }
          }
        }
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 32]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 500]
      }
    },
    price: {
      type: DataTypes.DECIMAL
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
