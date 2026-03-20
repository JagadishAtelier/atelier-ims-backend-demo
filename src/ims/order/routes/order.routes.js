import express from "express";
import orderController from "../controller/order.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { attachCompany } from "../../../middleware/company.middleware.js";
const router = express.Router();

router.post("/order", verifyToken(),attachCompany(), orderController.create);

router.get("/order", verifyToken(),attachCompany(), orderController.getAll);

router.get("/order/:id", verifyToken(),attachCompany(), orderController.getById);

router.put("/order/:id", verifyToken(),attachCompany(), orderController.update);

router.delete("/order/:id", verifyToken(),attachCompany(), orderController.delete);

export default router;
