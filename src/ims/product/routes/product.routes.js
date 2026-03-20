// routes/product.routes.js
import express from "express";
import productController from "../controller/product.controlller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { attachCompany } from "../../../middleware/company.middleware.js";

const router = express.Router();

// ✅ Create a new product
router.post('/product',verifyToken(),attachCompany(), productController.create);

// ✅ Get all products
router.get('/product',verifyToken(),attachCompany(), productController.getAll);

// ✅ Get product by ID
router.get('/product/:id',verifyToken(),attachCompany(), productController.getById);

router.get('/product/code/:code',verifyToken(),attachCompany(), productController.getByCode);

// ✅ Update product by ID
router.put('/product/:id',verifyToken(),attachCompany(), productController.update);

// ✅ Delete product by ID
router.delete('/product/:id',verifyToken(),attachCompany(), productController.delete);

export default router;
