const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  try {
    //const secretKey = "Blood-bank";
    const token = req.header("authorization").replace("Bearer ", "");
     console.log('SECRET_KEY:', process.env.secretKey);
    const decryptedData = jwt.verify(token, process.env.secretKey);
    req.body.userId = decryptedData.userId;
    next();
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};
