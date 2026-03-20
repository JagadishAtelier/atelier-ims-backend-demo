import { Router } from "express";
import userController from "../controller/user.controller.js";
import { verifyToken } from "../../middleware/auth.js"; // adjust path as needed
import demoCheck from "../../middleware/demoCheck.middleware.js"; // new middleware
const router = Router();


// 🔹 Public routes
router.post("/login", userController.loginUser);
router.post("/refresh-token", userController.refreshAccessToken);
router.post("/logout", userController.logoutUser);
router.post("/send-otp", userController.sendOtpToken);
router.get("/exists", userController.userAlreadyExists);

// 🔹 Protected routes (Require valid token)
router.get("/me/profile", verifyToken(),demoCheck, userController.getMe);
router.post("/change-password", verifyToken(),demoCheck, userController.changePassword);

// 🔹 Admin-only routes
router.post("/", verifyToken(["Admin", "Super Admin"]),demoCheck, userController.createUser);
router.get("/", verifyToken(["Admin", "Super Admin"]),demoCheck, userController.getUsers);
router.get("/:id", verifyToken(["Admin", "Super Admin"]),demoCheck, userController.getUserById);
router.put("/:id", verifyToken(["Admin", "Super Admin"]),demoCheck, userController.updateUserById);
router.delete("/:id", verifyToken(["Admin", "Super Admin"]),demoCheck, userController.softDeleteUser);
router.patch("/:id/restore", verifyToken(["Admin", "Super Admin"]),demoCheck, userController.restoreUser);

export default router;
