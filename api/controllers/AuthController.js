module.exports = {
  
  signup: async function (req, res) {
    
    const email = req.param('email')
    const password = req.param('password')

    if (!email) return res.json({ err: 'Invalid eMail' })
    if (!password) return res.json({ err: 'Invalid password' })
    if (password.length < 8) return res.json({ err: 'Password must be less than 8 characters' })


    try {

      const foundUser = await User.findOne({ email })
      if (foundUser) return res.json({ err: 'eMail already exists' })

      const encryptPassword = await UtilService.encryptPassword(password)
      
      const newUser = await User.create({
        email,
        password: encryptPassword
      }).fetch()

      delete newUser.password

      return res.ok(newUser)
    
    } catch (err) {
      
      return res.serverError(err)
    
    }

  },

  signin: async function (req, res) {
    
    const email = req.param('email')
    const password = req.param('password')

    if (!email) return res.badRequest({ err: 'Invalid eMail' })
    if (!password) return res.badRequest({ err: 'Invalid password' })

    try {

      let foundUser = await User.findOne({ email })
      if (!foundUser) return res.json({ err: 'Invalid eMail or password' })

      let isMatched = await User.checkPassword(password, foundUser.password)
      if (!isMatched) return res.json({ err: 'Invalid eMail or password' })

      let generatedJwt = await JwtService.generateJwt({ foundUser })
      if (!generatedJwt) return res.badRequest({ err: 'Invalid generated Jwt' })

      foundUser.jwt = generatedJwt
      
      delete foundUser.password

      return res.ok(foundUser)
    
    } catch (err) {
      
      return res.serverError(err)
    
    }

  },

  getCurrentUserByJwt: async function (req, res) {

    let receivedJwt = req.headers.authorization
    if (!receivedJwt) return res.badRequest({ err: 'invalid jwt' })
    
    let verifiedJwt = await JwtService.verifyJwt(receivedJwt)
    if (!verifiedJwt) return res.badRequest({ err: 'invalid verified jwt' })

    try {

      let currentUser = await User.findOne({ id: verifiedJwt.user.foundUser.id })

      if (!currentUser) return res.badRequest({ err: 'current user not found'})

      delete currentUser.password

      res.ok(currentUser)
      
    } catch (err) {

      return res.serverError(err)
      
    }

  }

}

