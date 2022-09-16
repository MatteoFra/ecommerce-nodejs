const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const checkPermissions = require("../utils/checkPermissions");

exports.getAllReviews = async (req, res) => {
  const reviews = await Review.find()
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({
      path: "user",
      select: "name",
    });
  res.status(StatusCodes.OK).json({
    results: reviews.length,
    reviews,
  });
};
exports.createReview = async (req, res) => {
  const { product } = req.body;
  const { userID } = req.user;
  req.body.user = userID;
  const validProduct = await Product.findById(product);
  if (!validProduct) {
    throw new CustomError.BadRequestError("Invalid porduct ID");
  }
  const alreadyReviewed = await Review.findOne({
    product,
    user: userID,
  });
  if (alreadyReviewed) {
    throw new CustomError.UnauthorizeError(
      "Sorry you already posted a review on this product"
    );
  }
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({
    review,
  });
};
exports.getSingleReview = async (req, res) => {
  const reviewID = req.params.id;
  const review = await Review.findById(reviewID);
  if (!review) {
    throw new CustomError.BadRequestError("No review found with that id");
  }
  res.status(StatusCodes.OK).json({
    review,
  });
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  const { user } = req;
  const review = await Review.findById(id);
  if (!review) {
    throw new CustomError.BadRequestError("No review found with that id");
  }
  checkPermissions(user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({
    msg: "review deleted",
  });
};

exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, title, comment } = req.body;
  const { user } = req;
  const review = await Review.findById(id);
  if (!review) {
    throw new CustomError.BadRequestError("No review found with that id");
  }
  checkPermissions(user, review.user);
  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();
  res.status(StatusCodes.OK).json({
    msg: "Review updated",
  });
};
