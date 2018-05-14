const jwt = require('jsonwebtoken')
const secret = 'greenPhoenixNoOneWillKnowWhatMySecretIs'


module.exports = {

  generateJwt(user) {

    return jwt.sign({ user }, secret)

  },

  verifyJwt(token) {

    return jwt.verify(token, secret)

  }
  
}