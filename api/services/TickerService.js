const axios = require('axios')

module.exports = {

  async getList() {
      
      // Загружаем тикеры из БД
      let tickerListFromDB = await Ticker.find()
      
      if (tickerListFromDB.length > 0) {
        // Проверяем на актуальность (10 минут)
        if (Date.now() - tickerListFromDB[0].createdAt < 600000)
          return tickerListFromDB[0].data
      }

      // Загружаем данные с Coin Market Cup
      let tickerListFromCoinMarketCup = await axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=10000')
        if (!tickerListFromCoinMarketCup.data) {
          const tickerListFromCoinMarketCup = await axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=10000')
        }

      // Экстракция полученных данных
      if (!tickerListFromCoinMarketCup) return { err: 'Ticker array from Coin Market Cup is invalid' }

      let tickerListFromCoinMarketCupUpdated = []
      for (let i = 0; i < tickerListFromCoinMarketCup.data.length; i++) {
        
        tickerListFromCoinMarketCupUpdated
        .push({
          
          ticker: tickerListFromCoinMarketCup.data[i].id,
          name: tickerListFromCoinMarketCup.data[i].name,
          symbol: tickerListFromCoinMarketCup.data[i].symbol,
          rank: tickerListFromCoinMarketCup.data[i].rank,
          price_usd: tickerListFromCoinMarketCup.data[i].price_usd,
          price_btc: tickerListFromCoinMarketCup.data[i].price_btc

        })
      
      }

      // Удаляем предыдущий документ
      if (tickerListFromCoinMarketCupUpdated) await Ticker.destroy({})
      else return { err: 'Ticker array is invalid' }

      // Записываем актуальные данные в БД
      let savedTickerList = await Ticker.create({ data: tickerListFromCoinMarketCupUpdated}).fetch()

      // Возвращаем записанный документ
      if (!savedTickerList.data) return { err: 'Error of writing tickers to the database' }
      return savedTickerList.data

  },

  // async getSupplyList() {

  //   // Загружаем данные с Coin Market Cup
  //   let tickerListFromCoinMarketCup = await axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=10000')
  //     if (!tickerListFromCoinMarketCup.data) {
  //       const tickerListFromCoinMarketCup = await axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=10000')
  //     }

  //   // Экстракция полученных данных
  //   if (!tickerListFromCoinMarketCup) return { err: 'Ticker array from Coin Market Cup is invalid' }

  //   let tickerListFromCoinMarketCupUpdated = []
  //   for (let ticker of tickerListFromCoinMarketCup.data) {
      
  //     let hodl_supply = (ticker.total_supply - ticker.available_supply) / (ticker.total_supply / 100) 

  //     if (hodl_supply < 20 && hodl_supply != 0 && ticker.rank >= 100 && ticker.rank <=200) {

  //       tickerListFromCoinMarketCupUpdated.push({
  //         name: ticker.name + ' (' + ticker.symbol + ')',
  //         rank: ticker.rank,
  //         available: ticker.available_supply,
  //         total: ticker.total_supply,
  //         max: ticker.max_supply,
  //         hodl_supply
  //       })

  //     }
    
  //   }

  //   // Возвращаем записанный документ
  //   if (!tickerListFromCoinMarketCupUpdated) return { err: 'Error of writing tickers to the database' }
  //   return tickerListFromCoinMarketCupUpdated

  // }
  
}