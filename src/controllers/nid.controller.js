const catchAsync = require("../utils/catchAsync.js");
const sendResponse = require("../utils/sendResponse.js");

const ApiError = require("../error/ApiError.js");

const pick = require("../utils/pick.js");
const calculatePagination = require("../utils/calculatePagination.js");
const Nid = require("../models/nid.model.js");
const handelFile = require("../utils/handelFile.js");

const createNid = catchAsync(async (req, res) => {
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "File not found");
  }

  const createdNidData = await Nid.create({
    ...req.body,
    user: req.user._id,
  });

  const fileName = `${Date.now()}-${file.originalname}`;
  const fileType = file.mimetype.split("/").pop();

  const cloudinaryResponse = await handelFile.uploadToCloudinary(file, {
    folder: "nid/nid-images",
    filename_override: fileName,
    format: fileType,
    public_id: createdNidData._id,
    overwrite: true,
    invalidate: true,
  });

  const updatedNidData = await Nid.findByIdAndUpdate(
    createdNidData._id,
    {
      photo: cloudinaryResponse.secure_url,
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    req.user._id,
    {},
    { $inc: { generatedPdfCount: 1 } }
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "NID created successfully",
    data: updatedNidData,
  });
});

const getNidsByUserId = catchAsync(async (req, res) => {
  const user = req.user;

  const searchableFields = ["b_name", "e_name", "nid_no"];
  const filters = pick(req.query, ["search"]);
  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);

  const { search } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions = [];

  if (search) {
    andConditions.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: search,
          $options: "i",
        },
      })),
    });
  }

  const sortConditions = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  andConditions.push({ user: user._id });

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Nid.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Nid.countDocuments(whereConditions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Nid fetched successfully",
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  });
});

const NidController = {
  createNid,
  getNidsByUserId,
};

module.exports = NidController;
