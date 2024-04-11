'use strict';
const { Model, Sequelize } = require('sequelize');

let schema;
if (process.env.NODE_ENV === 'production') {
  schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, { as: 'Owner', foreignKey: 'ownerId' })
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' })
      Spot.hasMany(models.Review, { foreignKey: 'spotId' })
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
      },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
      },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
      }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope: {
      include: [
        { association: 'Reviews',
          required: false,
          attributes: []
      },
      {
        association: 'SpotImages',
        required: false,
        attributes: []
      }
      ],
      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
        [ Sequelize.fn("COALESCE", Sequelize.col("SpotImages.url"),Sequelize.literal("'No image'")), "previewImage"],
        [Sequelize.fn('COALESCE', Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 0), 'numReviews']
      ],
      group: ["Spot.id", "SpotImages.url", "Reviews.id"],
    },
    scopes: {
      spotDetails: {
      include: [
        {
          association: "Owner",
          required: false,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          association: "SpotImages",
          required: false,
          attributes: ["id", "url", "preview"],
        },
        {
          association: "Reviews",
          required: false,
          attributes: [],
        },
      ],
      attributes: [
        [ Sequelize.fn("COALESCE", Sequelize.fn("COUNT", Sequelize.col("Reviews.id")), 0),"numReviews"],
      ],
      group: ["Spot.id","SpotImages.id", "Reviews.id", "Owner.id"],
    },
    spotInfo: {
      attributes: [
        "id",
        "ownerId",
        "address",
        "city",
        "state",
        "country",
        "lat",
        "lng",
        "name",
        "description",
        "price",
        "createdAt",
        "updatedAt",
      ],
      group: ["Spot.id"],
    },
  },
  });
  return Spot;
};
