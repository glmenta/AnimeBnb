'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' })
      Review.belongsTo(models.User, { foreignKey: 'userId' })
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId'})
    }
  }
  Review.init({
    userId:{
      type: DataTypes.INTEGER,
    },
    spotId: {
      type: DataTypes.INTEGER,
    },
    review:{
      type: DataTypes.STRING,
      allowNull: false
    },
    stars: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Review',
    defaultScope: {
      attributes: {
        include: [
          'id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'
        ]
      }
    },
    scopes: {
      spotReview: {
        include:
        [
          { association: "User", attributes: ['id', 'firstName', 'lastName'], required: false},
          { association: "ReviewImage", attributes: ['id', 'url'], required: false}
        ]
      }
    }
  });
  return Review;
};
