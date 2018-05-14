module.exports = {

  getList: async function (req, res) {
    
    try {

      let tickerList = await TickerService.getList()
      if (tickerList.err) return res.serverError(tickerList)

      return res.ok(tickerList)
    
    } catch (err) {
      
      return res.serverError(err)
    
    }

  },

  search: async function (req, res) {

    try {

      // Проверяем поисковый запрос
      let searchRequest = req.params.request.toLowerCase()
      if (!searchRequest) return res.serverError({ err: 'Search request is invalid' })
      
      // Поулчаем данные с Coin Market Cup
      let tickerList = await TickerService.getList()
      if (tickerList.err) return res.serverError(tickerList)

      // Перебираем полученные данные по имени и символу
      let foundTickers = []
      for (let i = 0; i < tickerList.length; i++) {
        
        let name = tickerList[i].name.toLowerCase()
        let symbol = tickerList[i].symbol.toLowerCase()
        let len = searchRequest.length
        
        if (name.substring(0, len) == searchRequest || symbol.substring(0, len) == searchRequest) {

          foundTickers.push(tickerList[i])

        }
        
      }
      
      // Возвращаем результат
      if (foundTickers.length == 0) return res.ok({ msg: 'not found' })
      return res.ok(foundTickers)
      
    } catch (err) {

      return res.serverError(err)
      
    }

  }

}

