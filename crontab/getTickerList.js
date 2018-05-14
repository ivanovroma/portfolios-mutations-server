module.exports = {
  async run () {
    const axios = require('axios')
    const list = await axios.get('http://localhost:1337/api/portfolios/test')
    console.log(list.data)
  }
}