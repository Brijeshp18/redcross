const router = require("express").Router();
const Inventory = require("../models/inventaryModel");
const User = require("../models/userModels");
const authMiddleware = require("../middleware/authMiddleware");
const { message } = require("antd");
const mongoose = require("mongoose");

//add inventory (API  to get the report)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // Check if user is hospital or donor ,validate email and inventory type
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("invalid Email");

    if (req.body.inventoryType === "in" && user.userType !== "donor") {
      throw new Error("This email is not registered as Donor");
    }
    if (req.body.inventoryType === "out" && user.userType !== "hospital") {
      throw new Error("The email is not Registered as Hospital");
    }
    // const inventory = new Inventory(req.body);

    if (req.body.inventoryType === "out") {
      // check if inventory is available
      const requestedGroup = req.body.bloodGroup;
      const requestedQuantity = req.body.quantity;
      const organization = new mongoose.Types.ObjectId(req.body.userId);

      const totalInofRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "in",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      console.log(totalInofRequestedGroup);
      const totalIn = totalInofRequestedGroup[0]?.total || 0;

      const totalOutofRequestedGroup = await Inventory.aggregate([
        {
          $match: {
            organization,
            inventoryType: "out",
            bloodGroup: requestedGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutofRequestedGroup[0]?.total || 0;

      const availableQuantityOfRequestedGroup = totalIn - totalOut;
      if (availableQuantityOfRequestedGroup < requestedQuantity) {
        throw new Error(`only ${availableQuantityOfRequestedGroup} units of ${requestedGroup.toUpperCase()} is only available`);
      }
      req.body.hospital = user._id; //to share the hospitals id
      // inventory.organization = user._id;
    } else {
      req.body.donor = user._id;
      // inventory.donor = user._id;
    }
    // To addd inventory
    const inventory = new Inventory(req.body);
    await inventory.save();
    return res.send({ message: "Inventory added succesfully", success: true });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//get inventory

router.get("/get", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find({ organization: req.body.userId })
    .sort({createdAt:-1})  
    .populate("donor")
      .populate("hospital");
    return res.send({ success: true, data: inventory });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

// To display recent 10 inventory details

router.post("/filter", authMiddleware, async (req, res) => {
  try {
    const inventory = await Inventory.find(req.body.filters).limit(req.body.limit || 10)
      .sort({createdAt:-1})
      .populate("donor")
      .populate("hospital")
      .populate("organization");
    return res.send({ success: true, data: inventory });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});



// filter option to find users 
router.post('/search', async (req, res) => {
  const searchInput = req.body.searchInput;
  
  try {
    
    const results = await Inventory.find({
      $or: [
        { bloodGroup: { $regex: new RegExp(searchInput, 'i') } },
        { name: { $regex: new RegExp(searchInput, 'i') } },
      ],
    });

    res.json({ data: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






module.exports = router;
