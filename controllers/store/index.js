const { default: mongoose } = require("mongoose");
const Store = require("../../model/Store");
const ErrorResponse = require("../../utils/errorResponse");

exports.create = async (req, res, next) => {
  // Get Values
  const { titleEn, titleBn, descriptionEn, descriptionBn, image } = req.body;

  try {
    // Storing Store to DB
    const store = await Store.create({
      titleEn,
      titleBn,
      descriptionEn,
      descriptionBn,
      image,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      data: store,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Store list fetched successfully",
      data: await Store.find(),
      total: await Store.find().count(),
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.update = async (req, res, next) => {
  // Get Values
  const { store_id } = req.params;

  if (!store_id || !mongoose.Types.ObjectId.isValid(store_id))
    next(new ErrorResponse("Please provide valid store id", 400));

  const { titleEn, titleBn, descriptionEn, descriptionBn, image } = req.body;

  try {
    // Update Store to DB
    const store = await Store.findByIdAndUpdate(
      store_id,
      {
        titleEn,
        titleBn,
        descriptionEn,
        descriptionBn,
        image,
      },
      {
        new: true,
      }
    );

    if (store)
      res.status(200).json({
        success: true,
        message: "Store updated successfully",
        data: store,
      });
    else next(new ErrorResponse("Store not found", 404));

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};

exports.activeInactive = async (req, res, next) => {
  // Get Values
  const { store_id } = req.params;

  if (!store_id || !mongoose.Types.ObjectId.isValid(store_id))
    next(new ErrorResponse("Please provide valid store id", 400));

  try {
    // Update Store to DB
    const store = await Store.findById(store_id).select("+isActive");

    if (!store) next(new ErrorResponse("No store found", 404));

    await store.updateOne({
      isActive: !store.isActive,
    });
    await store.save();

    res.status(200).json({
      success: true,
      message: `Store ${
        store.isActive ? "deactivated" : "activated"
      } successfully`,
    });

    // On Error
  } catch (error) {
    // Send Error Response
    next(error);
  }
};