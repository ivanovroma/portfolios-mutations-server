/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    email: {
      type: 'string',
      unique: true,
      required: true,
      isEmail: true
    },

    password: {
      type: 'string',
      // encrypt: true,
      required: true
    },

    createdAt: { type: 'number', autoCreatedAt: true },
    updatedAt: { type: 'number', autoUpdatedAt: true },

    // portfolios: {
    //   collection: 'portfolio',
    //   via: '_user'
    // }

  },

  checkPassword(password, encryptPassword) {
    
    const mPack = require('machinepack-passwords')

    return new Promise((resolve, reject) => {
      mPack.checkPassword({
        passwordAttempt: password,
        encryptedPassword: encryptPassword
      })
      .exec({
        error: err => reject(err),
        incorrect: () => resolve(false),
        success: () => resolve(true)
      })
    })
  }

};

