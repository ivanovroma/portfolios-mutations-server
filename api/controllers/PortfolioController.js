module.exports = {
  

  getListByUserId: async function (req, res) {

    let currentUserId = req.currentUser.id
    if (!currentUserId) return res.badRequest({ err: 'invalid current user' })

    try {

      let portfolioList = await Portfolio.find({ _user: currentUserId })

      return res.ok(portfolioList)
    
    } catch (err) {
      
      return res.serverError(err)
    
    }

  },

  create: async function (req, res) {
    
    let currentUserId = req.currentUser.id
    if (!currentUserId) return res.badRequest({ err: 'invalid current user id' })
    
    let portfolioName = req.param('name')
    if (!portfolioName) return res.badRequest({ err: 'invalid portfolio name' })
    
    try {
      
      let createdPortfolio = await Portfolio.create({
        name: portfolioName,
        _user: currentUserId
      }).fetch()

      if (!createdPortfolio) return res.serverError({ err: 'ivalid created portfolio' })

      return res.ok(createdPortfolio)
    
    } catch (err) {
      
      return res.serverError(err)
    
    }

  },

  remove: async function (req, res) {

    let portflioId = req.params.id
    if (!portflioId) return res.badRequest({ err: 'invalid portfolio id' })
    
    let currentUserId = req.currentUser.id
    if (!currentUserId) return res.badRequest({ err: 'invalid current user id' })

    try {

      let removePortfolio = await Portfolio.findOne({ id: portflioId })
      if (!removePortfolio) return res.badRequest({ err: 'portfolio not found' })
    
      if (removePortfolio._user === currentUserId) {
        
        await Asset.destroy({ _portfolio: portflioId })
      
        let removedPortfolioData = await Portfolio.destroy({ id: portflioId }).fetch()
        let removedPortfolio = removedPortfolioData[0]
        
        return res.ok(removedPortfolio)
      
      }
      
      return res.badRequest({ err: 'permission denied' })
      
    } catch (err) {
      
      return res.serverError(err)

    }

  },

  update: async function (req, res) {

    let portfolioId = req.params.id
    if (!portfolioId) return res.badRequest({ err: 'invalid portfolio id' })
    
    let newName = req.body.name
    if (!newName) return res.badRequest({ err: 'invalid portfolio new name' })
    
    let currentUserId = req.currentUser.id
    if (!currentUserId) return res.badRequest({ err: 'invalid current user' })
    
    try {
      
      let updatePortfolio = await Portfolio.findOne({ id: portfolioId })
      if (!updatePortfolio) return res.badRequest({ err: 'invalid update portfolio' })
    
      if (updatePortfolio._user === currentUserId) {
        
        let updatedPortfolioData = await Portfolio.update({ id: portfolioId }).set({
          name: req.body.name
        }).fetch()

        let updatedPortfolio = updatedPortfolioData[0]

        return res.ok(updatedPortfolio)
      
      }

      return res.badRequest()
      
    } catch (err) {

      return res.serverError(err)
      
    }

  }

};

