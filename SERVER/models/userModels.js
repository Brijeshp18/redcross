const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    // common for all
    userType: {
      type: String,
      required: true,
      enum: ["donor","hospital","organization","admin"],
    },
    //name field is for admin and donor
    name: {
      type: String,
      required: function () {
        if (this.userType == "donor" || this.userType == "admin") {
          return true;
        }
        return false;
      },
    },

    bloodGroup: {
      type: String,
      required: function () {
        if (this.userType == "donor" || this.userType == "admin") {
          return true;
        }
        return false;
      },
    },
    owner: {
      type: String,
      required: function () {
        if (this.userType == "hospital" || this.userType == "organization") {
          return true;
        }
        return false;
      },
    },
   

    //hospital Name is for hospital
    hospitalName: {
      type: String,
      required: function () {
        if (this.userType == "hospital") {
          return true;
        }
        return false;
      },
    },
    //organization Name is for organization
    organizationName: {
      type: String,
      required: function () {
        if (this.userType == "organization") {
          return true;
        }
        return false;
      },
    },

    email: {
      type: String,
      required: false,

      required: function () {
        if (this.userType == "hospital" || this.userType == "organization") {
          return true;
        }
        return false;
      },
      unique: false,
    },

    password: {
      type: String,
      required: function () {
        if (this.userType == "hospital" || this.userType == "organization") {
          return true;
        }
        return false;
      },

    }, 
  isEmailverified: {
    type: Boolean,
    default: false,
  }, 
    // common for all
    phone: {
      type: String,
      required: true,
    },
    //website is for hospital and organization
    website: {
      type: String,
      required: function () {
        if (this.userType == "hosiptal" || this.userType == "organization") {
          return true;
        }
        return false;
      },
    },
    // address is for hospital and organization
    address: {
      type: String,
      required: function () {
        if (this.userType == "hosiptal" || this.userType == "organization") {
          return true;
        }
        return false;
      },
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
 