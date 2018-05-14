/**
 * Asset.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    data: {
      type: 'json',
      required: true
    },

    createdAt: { type: 'number', autoCreatedAt: true }

  },

};

