const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    //Validating the JWT token
    const token = req.headers.authorization.split(" ")[1]; //contains bearer token from bearer {token} = [bearer],[{token}]
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    req.user = { id: decodedToken.userId };
    next();
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
};
