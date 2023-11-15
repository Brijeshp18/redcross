const User = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const nodemailer = require("nodemailer");

exports.register= async (req, res) => {
  try {
    // check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // save user
    const user = new User(req.body);
    await user.save();

    return res.send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
};

exports.login= async (req, res) => {
  try {
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

    // check if userType matches
    if (user.userType !== req.body.userType) {
      return res.send({
        success: false,
        message: `User is not registered as a ${req.body.userType}`,
      });
    }
          
      
      //compare password
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return res.send({
          success: false,
          message: "Invalid password.",
        });
      }
  
      // Create a JWT token for authentication 1st parameter will be data we want to encrypt 2nd will be  secret key to decrypt the data 3rd will be timeout(how much time will be the validity is)
      
      const payload ={ userId: user._id }; 
      // const secretKey ='Blood-bank' //process.env.jwt_secret    
      const token = jwt.sign(payload,process.env.secretKey, { expiresIn: '2d' });
      console.log("token is here ", token);
      return res.send({
        success: true,
        message: "user logged in sucessfully",
        data: token,
      });
    }
    catch (error) {
      return res.send({
        success: false,
        message: error.message,
      });
    }}
  


 
  