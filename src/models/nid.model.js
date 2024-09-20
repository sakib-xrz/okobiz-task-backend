const mongoose = require("mongoose");

const nidSchema = new mongoose.Schema(
  {
    b_name: {
      type: String,
      required: true,
    },
    e_name: {
      type: String,
      required: true,
    },
    father_name: {
      type: String,
      required: true,
    },
    mother_name: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    nid_no: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    house_or_holding: {
      type: String,
      required: true,
    },
    village_or_road: {
      type: String,
      required: true,
    },
    post_office: {
      type: String,
      required: true,
    },
    upazila: {
      type: String,
      required: true,
    },
    zila: {
      type: String,
      required: true,
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    card_issue_date: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "",
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Nid = mongoose.model("Nid", nidSchema);

module.exports = Nid;
