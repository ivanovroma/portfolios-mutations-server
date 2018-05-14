/**
 * Portfolio.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true
    },

    createdAt: { type: 'number', columnType: 'date', autoCreatedAt: true },
    updatedAt: { type: 'number', columnType: 'date', autoUpdatedAt: true },
    
    assets: {
      collection: 'asset',
      via: '_portfolio'
    },

    _user: {
      model: 'user',
      columnName: '_user',
      required: true
    }

  }

};

