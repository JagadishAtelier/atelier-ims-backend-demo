// routes/inward.routes.js
import express from "express";
import inwardController from "../controller/inward.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { attachCompany } from "../../../middleware/company.middleware.js";
const router = express.Router();

// ✅ Create a new inward with items
router.post("/inward", verifyToken(),attachCompany(), inwardController.create);

// ✅ Get all inwards (with filters + pagination)
router.get("/inward", verifyToken(),attachCompany(), inwardController.getAll);

// ✅ Get inward by ID (with items)
router.get("/inward/:id", verifyToken(),attachCompany(), inwardController.getById);

// ✅ Update inward by ID (with items)
router.put("/inward/:id", verifyToken(),attachCompany(), inwardController.update);

// ✅ Delete inward by ID (soft delete)
router.delete("/inward/:id", verifyToken(),attachCompany(), inwardController.delete);

export default router;
