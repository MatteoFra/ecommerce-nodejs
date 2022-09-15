const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authentication");

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authMiddleware.authenticateUser,
    authMiddleware.authorizePermissions("admin", "owner"),
    productController.createProduct
  );

router.post(
  "/uploadImage",
  authMiddleware.authenticateUser,
  authMiddleware.authorizePermissions("admin", "owner"),
  productController.uploadImage
);

router
  .route("/:id")
  .get(productController.getSingleProduct)
  .patch(
    authMiddleware.authenticateUser,
    authMiddleware.authorizePermissions("admin", "owner"),
    productController.updateProduct
  )
  .delete(
    authMiddleware.authenticateUser,
    authMiddleware.authorizePermissions("admin", "owner"),
    productController.deleteProduct
  );

module.exports = router;
