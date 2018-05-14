module.exports = {
  
  getListByUserId: async function (req, res) {

    let currentUserId = req.currentUser.id
    if (!currentUserId) return res.badRequest({ err: 'invalid current user' })    
    
    try {

      let assetList = await Asset.find({
        _user: currentUserId
      })

      return res.ok(assetList)
      
    } catch (err) {
      
      return res.serverError(err)

    }

  },

  create: async function (req, res) {

    let ticker = req.param('ticker')
    if (!ticker) return res.badRequest({ err: 'invalid ticker' })

    let amount = req.param('amount')
    if (!amount) return res.badRequest({ err: 'invalid size asset' })

    let buyPrice = req.param('buyPrice')
    if (!buyPrice) return res.badRequest({ err: 'invalid entry price' })

    let portfolioId = req.param('portfolioId')
    if (!portfolioId) return res.badRequest({ err: 'invalid portfolio id' })

    let currentUser = req.currentUser.id
    if (!currentUser) return res.badRequest({ err: 'invalid current user' })
    
    try {
      
      let createdAsset = await Asset.create({
        ticker: ticker,
        amount: amount,
        buyPrice: buyPrice,
        _portfolio: portfolioId,
        _user: currentUser
      }).fetch()

      if (!createdAsset) return res.badRequest({ err: 'error write Asset to database' })

      return res.ok(createdAsset)
    
    } catch (err) {
      
      return res.serverError(err)
    
    }
  },

  update: async function (req, res) {

    let currentUserId = req.currentUser.id
    if (!currentUserId) return res.badRequest({ err: 'invalid current user id' })

    let updateAssetId = req.params.id
    if (!updateAssetId) return res.badRequest({ err: 'invalid asset id' })
    
    let newAmount = req.body.amount
    if (!newAmount) return res.badRequest({ err: 'invalid size asset' })

    let newBuyPrice = req.body.buyPrice
    if (!newBuyPrice) return res.badRequest({ err: 'invalid entry price' })

    try {

      let updateAsset = await Asset.findOne({ id: updateAssetId })
    
      if (updateAsset._user === currentUserId) {
        
        let updatedAsset = await Asset.update({ id: updateAssetId }).set({
          buyPrice: newBuyPrice,
          amount: newAmount
        }).fetch()

        return res.ok(updatedAsset[0])

      }

      return res.badRequest({ err: 'permission denied' })
      
    } catch (err) {

      return res.serverError(err)
      
    }

  },

  remove: async function (req, res) {

    const assetId = req.params.id
    if (!assetId) return res.badRequest({ err: 'invalid portfolio id' })

    const currentUser = req.currentUser.id
    if (!currentUser) return res.badRequest({ err: 'invalid user id' })
    
    try {

      let removeAsset = await Asset.findOne({ id: assetId })

      if (!removeAsset) return res.badRequest({ err: 'Asset not found' })
    
      if (removeAsset._user === currentUser) {
        
        let removedAssetData = await Asset.destroy({ id: assetId }).fetch()
        let removedAsset = removedAssetData[0]
        
        return res.ok(removedAsset)
      
      }
      
      return res.badRequest({ err: 'permission denied' })
      
    } catch (err) {
      
      return res.serverError(err)

    }
    
  }

}

