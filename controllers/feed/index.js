const { default: mongoose } = require("mongoose");
const Attachment = require("../../model/Attachment");
const Category = require("../../model/Category");
const FeedImage = require("../../model/FeedImage");
const ErrorResponse = require("../../utils/errorResponse");

// Get Feed Images API
exports.getImages = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Images fetched successfully",
      data: await FeedImage.find({}),
      total: await FeedImage.find({}).count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.saveImages = async (req, res, next) => {
  let attachmentList = req.files
    ? req.files.map((file) => {
        return {
          mimetype: file.mimetype,
          filename: file.filename,
          size: file.size,
        };
      })
    : [];

  if (!attachmentList.length)
    next(new ErrorResponse("No attachments added", 404));

  try {
    const attachment = await Attachment.insertMany(attachmentList);
    await FeedImage.insertMany(
      Array.from(attachment, (per) => {
        return {
          image: per._id.toString(),
        };
      })
    );

    res.status(201).json({
      success: true,
      message: "Attachments uploaded successfully",
    });
  } catch (error) {
    // On Error
    // Send Error Response
    next(error);
  }
};

exports.delImage = async (req, res, next) => {
  const { feed_id } = req.params;

  if (!feed_id || !mongoose.Types.ObjectId.isValid(feed_id))
    next(new ErrorResponse("Please provide valid feed image id", 400));

  try {
    // const imageInfo =
    await FeedImage.findByIdAndDelete(feed_id);
    // await Attachment.findByIdAndDelete(imageInfo.image);
    res.status(200).json({
      success: true,
      message: "Feed image deleted successfully",
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

// News Feed API
exports.getFeedCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Category list fetched successfully",
      data: await Category.find().populate(
        "totalSubcategories subcategories products"
      ),
      total: await Category.find().count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};