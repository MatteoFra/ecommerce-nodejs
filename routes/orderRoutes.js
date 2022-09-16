const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authentication");
const orderController = require("../controllers/orderController");

router
  .route("/")
  .post(authMiddleware.authenticateUser, orderController.createOrder)
  .get(
    authMiddleware.authenticateUser,
    authMiddleware.authorizePermissions("admin", "owner"),
    orderController.getAllOrders
  );

router
  .route("/showAllMyOrders")
  .get(authMiddleware.authenticateUser, orderController.getCurrentUserOrders);

router
  .route("/:id")
  .get(orderController.getSingleOrder)
  .patch(authMiddleware.authenticateUser, orderController.updateOrder);

module.exports = router;
