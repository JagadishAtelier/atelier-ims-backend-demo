// routes/billing.routes.js
import express from "express";
import billingController from "../controller/billing.controller.js";
import { verifyToken } from "../../../middleware/auth.js";
import { attachCompany } from "../../../middleware/company.middleware.js";
const router = express.Router();

router.post("/billing", verifyToken(),attachCompany(), billingController.create);

router.get("/billing", verifyToken(),attachCompany(), billingController.getAll);

router.get("/billing/:id", verifyToken(),attachCompany(), billingController.getById);

router.put("/billing/:id", verifyToken(),attachCompany(), billingController.update);

router.delete("/billing/:id", verifyToken(),attachCompany(), billingController.delete);

export default router;
