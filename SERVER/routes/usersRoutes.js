const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const apiController = require("../controllers/apiControl");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const Inventory = require("../models/inventaryModel");

//register a new user
/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user.
 *     tags: [users]
 *     description: Register a new user based on their user type (donor, hospital, or organization).
 *     tag : ["Users"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userType:
 *                 type: string
 *                 enum: [donor, hospital, organization]
 *                 description: The type of user (donor, hospital, or organization).
 *               aadharcardnumber:
 *                 type: string
 *                 description: The Aadhar card number (required for donors).
 *               email:
 *                 type: string
 *                 description: The email address (required for hospitals and organizations).
 *               password:
 *                 type: string
 *                 description: The user's password.
 *               phone:
 *                  type: string
 *
 *     responses:
 *       200:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the registration was successful.
 *                 message:
 *                   type: string
 *                   description: A message indicating the registration status.
 *       400:
 *         description: Bad Request. Invalid user type or existing user with the same Aadhar card number or email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the registration failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the registration status.
 *       500:
 *         description: Internal Server Error. Registration failed due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the registration failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the registration status.
 *
 */

router.post("/register", apiController.register);
//login functions

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login.
 *     tags: [users]
 *     description: Authenticate and login a user based on their user type (donor, hospital, or organization).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userType:
 *                 type: string
 *                 enum: [donor, hospital, organization]
 *                 description: The type of user (donor, hospital, or organization).
 *               aadharcardnumber:
 *                 type: string
 *                 description: The Aadhar card number (required for donors).
 *               email:
 *                 type: string
 *                 description: The email address (required for hospitals and organizations).
 *               password:
 *                 type: string
 *                 description: The user's password.
 *               organizationName:
 *                 type: string
 *                 description: The organization name.
 *               hospitalName:
 *                 type: string
 *                 description: The hospital name.
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the login was successful.
 *                 message:
 *                   type: string
 *                   description: A message indicating the login status.
 *                 data:
 *                   type: string
 *                   description: JWT token for authentication.
 *       400:
 *         description: Bad Request. Invalid user type or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the login failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the login status.
 *       401:
 *         description: Unauthorized. Invalid password or user type mismatch.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the login failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the login status.
 *       500:
 *         description: Internal Server Error. Login failed due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the login failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the login status.
 */

router.post("/login", apiController.login);

// generate token
//   const token = jwt.sign({ userId: user._id }, process.env.jwt_secret, {
//     expiresIn: "1d",
//   });
// console.log("sign is going",token)
//   return res.send({
//     success: true,
//     message: "User logged in successfully",
//     data: token,
//   });
// }} catch (error) {
//   return res.send({
//     success: false,
//     message: error.message,
//   });

// }

// });

//get current user
// router.get("/get-Current-User",authMiddleware,async (req,res)=>{
// try {
//   const user = await user.findOne({_id:req.body.userid});
//   console.log("getuser",user)
//   // remove password of user
//   user.password = undefined;
//   return res.send({
//     success:true,
//     message:"user fetched succesfully",
//     data:user,
//   })

// } catch (error) {
//  return res.send({
//   success:false,
//   message:error.message,

//  })
// }
// })

// get current user

/**
 * @swagger
 * /api/users/get-current-user:
 *   get:
 *     summary: Get the current user.
 *     tags: [users]
 *     description: Retrieve the details of the currently authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates whether the user data retrieval was successful.
 *                 message:
 *                   type: string
 *                   description: A message indicating the status of the operation.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized. User authentication failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the user is not authenticated.
 *                 message:
 *                   type: string
 *                   description: A message indicating the status of the operation.
 *       500:
 *         description: Internal Server Error. User data retrieval failed due to a server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates that the operation failed.
 *                 message:
 *                   type: string
 *                   description: A message indicating the status of the operation.
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for the user.
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email address of the user.
 */

router.get("/current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
    });
    console.log("user is", user);
    return res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});


router.get("/all-donors", authMiddleware, async (req, res) => {
  try {
    // get all unique donor ids from inventory
   
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueDonorIds = await Inventory.distinct("donor", {
      organization,
    });

    const donars = await User.find({
      _id: { $in: uniqueDonorIds },
    });

    return res.send({
      success: true,
      message: "Donors fetched successfully",
      data: donars,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

router.get("/all-hospitals", authMiddleware, async (req, res) => {
  //get all unique hospital ids from inventory
  try {
    const organization = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueHospitalIds = await Inventory.distinct("hospital", {
      organization,
    });
    const hospital = await User.find({
      _id: { $in: uniqueHospitalIds },
    }).populate("owner");
    return res.send({
      success: true,
      message: "Hospital fetched successfully",
      data: hospital,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// get all unique organization for a donor

router.get("/all-organizations-of-a-donor", authMiddleware, async (req, res) => {
  //get all unique hospital ids from inventory
  try {
    const donor = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueOrganizationIds = await Inventory.distinct("organization", {
      donor,
    });
    const hospital = await User.find({
      _id: { $in: uniqueOrganizationIds },
    }).populate("owner");
    return res.send({
      success: true,
      message: "Hospital fetched successfully",
      data: hospital,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});



// get all unique organization for a hospital

router.get("/all-organizations-of-a-hospital", authMiddleware, async (req, res) => {
  //get all unique hospital organization ids from inventory
  try {
    const hospital = new mongoose.Types.ObjectId(req.body.userId);
    const uniqueOrganizationIds = await Inventory.distinct("organization", {
      hospital,  
    });
    const hospitals = await User.find({
      _id: { $in: uniqueOrganizationIds },
    }).populate("owner");
    return res.send({
      success: true,
      message: "Hospital fetched successfully",
      data: hospitals,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});









module.exports = router;
