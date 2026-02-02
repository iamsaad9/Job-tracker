const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Authorization header is missing",
        success: false,
      });
    }

    //Validating the JWT token
    const token = req.headers.authorization.split(" ")[1]; //contains bearer token from bearer {token} = [bearer],[{token}]
    
    if (!token) {
      return res.status(401).json({
        message: "Token is missing",
        success: false,
      });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    req.user = { id: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message,
      success: false,
    });
  }
};
