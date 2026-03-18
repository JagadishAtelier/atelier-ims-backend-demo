import express from "express";
import * as recordsController from "../controller/records.controller.js";

const router = express.Router();

// ======================= RECORD TYPES =======================
router.get("/types", recordsController.getAllRecordTypes);
router.get("/types/:id", recordsController.getRecordTypeById);
router.post("/types", recordsController.createRecordType);
router.put("/types/:id", recordsController.updateRecordType);
router.delete("/types/:id", recordsController.deleteRecordType);

// ======================= RECORD TEMPLATES =======================
router.get("/templates", recordsController.getAllTemplates);
router.get("/templates/:id", recordsController.getTemplateById);
router.post("/templates", recordsController.createTemplate);
router.put("/templates/:id", recordsController.updateTemplate);
router.delete("/templates/:id", recordsController.deleteTemplate);


// ======================= MEDICAL RECORDS =======================
router.get("/records", recordsController.getAllRecords);
router.get("/records/:id", recordsController.getRecordById);
router.post("/records", recordsController.createRecord);
router.put("/records/:id", recordsController.updateRecord);
router.delete("/records/:id", recordsController.deleteRecord);

export default router;
