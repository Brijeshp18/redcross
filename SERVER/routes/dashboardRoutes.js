const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const Inventory = require("../models/inventaryModel");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// get all blood groups totalIn , totalOut , available data from inventory
router.get("/blood-groups-data", authMiddleware, async (req, res) => {
  try {
    const allBloodgroups = ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"];
    console.log("userId",req.body.userId)
    const organization = new ObjectId(req.body.userId);
    console.log("organization",organization)
    const bloodGroupsData = [];
    
    await Promise.all(
      allBloodgroups.map(async (bloodGroup) => {
        console.log(typeof bloodGroup)
        const totalIn = await Inventory.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType:"in",
              organization: organization
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$quantity",
              },
            },
          },

        ]);
         console.log("totalin",totalIn)

        const totalOut = await Inventory.aggregate([
          {
            $match: {
              bloodGroup: bloodGroup,
              inventoryType: "out",
              organization,
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$quantity",
              },
            },
          },
        ]);

        const available = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

        bloodGroupsData.push({
          bloodGroup,
           totalIn: totalIn[0]?.total || 0,
           totalOut: totalOut[0]?.total || 0,
           available,
        });
      })
    );

    res.send({
      success: true,
      message: "Blood Groups Data",
      data: bloodGroupsData,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;