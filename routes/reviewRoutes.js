const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authentication");
const reviewController = require("../controllers/reviewController");

router
  .route("/")
  .post(authMiddleware.authenticateUser, reviewController.createReview)
  .get(reviewController.getAllReviews);

router
  .route("/:id")
  .get(reviewController.getSingleReview)
  .patch(authMiddleware.authenticateUser, reviewController.updateReview)
  .delete(authMiddleware.authenticateUser, reviewController.deleteReview);

module.exports = router;
