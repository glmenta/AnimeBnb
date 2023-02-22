'use strict';
const { Model, Validator } = require('sequelize');

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    //This method will return an object with only the User instance information that is safe to save to a JWT, like id, username, and email.
    toSafeObject() {
      const { id, username, email, firstName, lastName } = this; // context will be the User instance
      return { id, username, email, firstName, lastName };
    }
    //Define an instance method validatePassword in the user.js model file.
    //It should accept a password string and return true if there is a match with the User instance's hashedPassword. If there is no match, it should return false.
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    //Define a static method getCurrentUserById in the user.js model file that accepts an id. It should use the currentUser scope to return a User with that id.
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }

    //Define a static method login in the user.js model file.
    //It should accept an object with credential and password keys.
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
       //The method should search for one User with the specified credential (either a username or an email).
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
       //If a user is found, then the method should validate the password by passing it into the instance's .validatePassword method.
      if (user && user.validatePassword(password)) {
      //If the password is valid, then the method should return the user by using the currentUser scope.
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    //Define a static method signup in the user.js model file that accepts an object with a username, email, and password key.
    static async signup({ username, email, password, firstName, lastName }) {
    //Hash the password using the bcryptjs package's hashSync method. Create a User with the username, email, and hashedPassword.
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        username,
        email,
        hashedPassword,
        firstName,
        lastName
      });
    //Return the created user using the currentUser scope.
      return await User.scope('currentUser').findByPk(user.id);
    }

    static associate(models) {
      // define association here
      User.hasMany(models.Spot, { foreignKey: 'ownerId' })
      User.hasMany(models.Booking, { foreignKey: 'userId'})
      User.hasMany(models.Review, {as: 'Owner', foreignKey: 'userId'})
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      notEmpty: true,
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  },
  {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword', 'email', 'createdAt','updatedAt']
      }
    },
    scopes: {
      currentUser: {
        attributes: { exclude: ['hashedPassword'] }
      },
      loginUser: {
        attributes: {}
      }
    }
  }
);
  return User;
};
