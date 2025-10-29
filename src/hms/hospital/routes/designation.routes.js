import express from "express";
import designationController from "../controller/designation.controller.js";
import { verifyToken } from "../../../middleware/auth.js"; // authentication middleware
import { validate } from "../../../middleware/validate.js";
import {
  createDesignationSchema,
  updateDesignationSchema,
} from "../dto/designation.dto.js";

const router = express.Router();

// Create designation
router.post(
  "/designation",
  verifyToken(["Admin", "Super Admin"]),
  validate(createDesignationSchema),
  designationController.create
);

// Get all designations
router.get("/designation", verifyToken(), designationController.getAll);

// Get designation by ID
router.get("/designation/:id", verifyToken(), designationController.getById);

// Update designation
router.put(
  "/designation/:id",
  verifyToken(["Admin", "Super Admin"]),
  validate(updateDesignationSchema),
  designationController.update
);

// Soft delete designation
router.delete(
  "/designation/:id",
  verifyToken(["Admin", "Super Admin"]),
  designationController.delete
);

// Restore soft-deleted designation
router.patch(
  "/designation/:id/restore",
  verifyToken(["Admin", "Super Admin"]),
  designationController.restore
);

export default router;
