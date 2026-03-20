// routes/subcategory.routes.js
import express from "express";
import subcategoryController from "../controller/subcategory.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { attachCompany } from "../../../middleware/company.middleware.js";
const router = express.Router();

// ✅ Create a new subcategory
router.post('/subcategory', verifyToken(),attachCompany(), subcategoryController.create);

// ✅ Get all subcategories
router.get('/subcategory', verifyToken(),attachCompany(), subcategoryController.getAll);

// ✅ Get subcategory by ID
router.get('/subcategory/:id', verifyToken(),attachCompany(), subcategoryController.getById);

// ✅ Update subcategory by ID
router.put('/subcategory/:id', verifyToken(),attachCompany(), subcategoryController.update);

// ✅ Delete subcategory by ID (soft delete)
router.delete('/subcategory/:id', verifyToken(),attachCompany(), subcategoryController.delete);

export default router;
