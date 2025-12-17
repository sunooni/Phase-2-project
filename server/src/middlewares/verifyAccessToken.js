const jwt = require('jsonwebtoken')


function verifyAccessToken(req, res, next) {
  try {

    if (!req.headers.authorization) {
      res.sendStatus(401)
    }

    const accessToken = req.headers.authorization.split(' ')[1];
    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    res.locals.user = user;
    next()

  } catch (err) {
    console.log(err);
    res.sendStatus(403)
  }

}

module.exports = verifyAccessToken