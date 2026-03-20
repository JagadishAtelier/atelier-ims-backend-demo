// routes/category.routes.js
import express from "express";
import categoryController from "../controller/category.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { attachCompany } from "../../../middleware/company.middleware.js";
const router = express.Router();

// ✅ Create a new category
router.post('/category', verifyToken(),attachCompany(), categoryController.create);

// ✅ Get all categories
router.get('/category', verifyToken(),attachCompany(), categoryController.getAll);

// ✅ Get category by ID
router.get('/category/:id', verifyToken(),attachCompany(), categoryController.getById);

// ✅ Update category by ID
router.put('/category/:id', verifyToken(),attachCompany(), categoryController.update);

// ✅ Delete category by ID (soft delete)
router.delete('/category/:id', verifyToken(),attachCompany(), categoryController.delete);

export default router;
