const Router = require("express");
const userController = require("../controllers/user.controller.js");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth.middleware.js");

const router = Router();

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isString().isLength({ min: 3, max: 25 }),
  userController.registration
);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/activate/:link", userController.activate);
router.get("/refresh", userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);

module.exports = router;
