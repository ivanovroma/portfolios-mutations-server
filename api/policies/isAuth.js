module.exports = async function (req, res, proceed) {
  
  const receivedJwt = req.headers.authorization
  if (!receivedJwt) return res.badRequest({ err: 'invalid jwt' })

  const verifiedJwt = await JwtService.verifyJwt(receivedJwt)
  
  User.findOne({ id: verifiedJwt.user.foundUser.id }).then(user => {
    
    if(!user) return proceed({ err: 'invalid credentials' })

    req.currentUser = verifiedJwt.user.foundUser
    proceed()

  })

}