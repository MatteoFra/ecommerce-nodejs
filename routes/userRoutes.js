const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authentication");

const userController = require("../controllers/userController");

router
  .route("/")
  .get(
    authMiddleware.authenticateUser,
    authMiddleware.authorizePermissions("admin", "owner"),
    userController.getAllUsers
  );
router
  .route("/showMe")
  .get(authMiddleware.authenticateUser, userController.showCurrentUser);
router.route("/updateUser").patch(userController.updateUser);
router
  .route("/updateUserPassword")
  .patch(authMiddleware.authenticateUser, userController.updateUserPassword);

router
  .route("/:id")
  .get(
    authMiddleware.authenticateUser,
    authMiddleware.authorizePermissions("admin", "owner"),
    userController.getSingleUser
  );

module.exports = router;
