module.exports = {

  attributes: {

    ticker: {
      type: 'string',
      required: true
    },

    amount: {
      type: 'number',
      required: true
    },

    buyPrice: {
      type: 'number',
      required: true
    },

    createdAt: { type: 'number', autoCreatedAt: true },
    updatedAt: { type: 'number', autoUpdatedAt: true },

    _portfolio: {
      model: 'portfolio',
      columnName: '_portfolio',
      required: true
    },

    _user: {
      model: 'user',
      columnName: '_user',
      required: true
    }

  },

};

