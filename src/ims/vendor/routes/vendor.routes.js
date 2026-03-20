// routes/vendor.routes.js
import express from "express";
import vendorController from "../controller/vendor.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { attachCompany } from "../../../middleware/company.middleware.js";
const router = express.Router();

// ✅ Create a new vendor
router.post("/vendor", verifyToken(),attachCompany (), vendorController.create);

// ✅ Get all vendors
router.get("/vendor", verifyToken(),attachCompany (), vendorController.getAll);

// ✅ Get vendor by ID
router.get("/vendor/:id", verifyToken(),attachCompany (), vendorController.getById);

// ✅ Get vendor by code
router.get("/vendor/code/:code", verifyToken(),attachCompany (), vendorController.getByCode);

// ✅ Update vendor by ID
router.put("/vendor/:id", verifyToken(),attachCompany (), vendorController.update);

// ✅ Soft delete vendor by ID
router.delete("/vendor/:id", verifyToken(),attachCompany (), vendorController.delete);

export default router;
