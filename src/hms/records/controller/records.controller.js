import recordsService from "../service/records.service.js";
import * as schemas from "../dto/records.dto.js";

// ======================= RECORD TYPES =======================

export const getAllRecordTypes = async (req, res) => {
    try {
        const types = await recordsService.getAllRecordTypes(req.query);
        res.status(200).json({ status: "success", data: types });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getRecordTypeById = async (req, res) => {
    try {
        const type = await recordsService.getRecordTypeById(req.params.id);
        res.status(200).json({ status: "success", data: type });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
};

export const createRecordType = async (req, res) => {
    try {
        const validatedData = schemas.createRecordTypeSchema.parse(req.body);
        const type = await recordsService.createRecordType(validatedData);
        res.status(201).json({ status: "success", data: type });
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ status: "error", message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateRecordType = async (req, res) => {
    try {
        const validatedData = schemas.updateRecordTypeSchema.parse(req.body);
        const type = await recordsService.updateRecordType(req.params.id, validatedData);
        res.status(200).json({ status: "success", data: type });
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ status: "error", message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteRecordType = async (req, res) => {
    try {
        await recordsService.deleteRecordType(req.params.id);
        res.status(200).json({ status: "success", message: "Record Type deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// ======================= RECORD TEMPLATES =======================

export const getAllTemplates = async (req, res) => {
    try {
        const templates = await recordsService.getAllTemplates(req.query);
        res.status(200).json({ status: "success", data: templates });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getTemplateById = async (req, res) => {
    try {
        const template = await recordsService.getTemplateById(req.params.id);
        res.status(200).json({ status: "success", data: template });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
};

export const createTemplate = async (req, res) => {
    try {
        const validatedData = schemas.createTemplateSchema.parse(req.body);
        const template = await recordsService.createTemplate(validatedData);
        res.status(201).json({ status: "success", data: template });
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ status: "error", message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateTemplate = async (req, res) => {
    try {
        const validatedData = schemas.updateTemplateSchema.parse(req.body);
        const template = await recordsService.updateTemplate(req.params.id, validatedData);
        res.status(200).json({ status: "success", data: template });
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ status: "error", message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteTemplate = async (req, res) => {
    try {
        await recordsService.deleteTemplate(req.params.id);
        res.status(200).json({ status: "success", message: "Template deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


// ======================= MEDICAL RECORDS =======================

export const getAllRecords = async (req, res) => {
    try {
        const records = await recordsService.getAllRecords(req.query);
        res.status(200).json({ status: "success", data: records });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getRecordById = async (req, res) => {
    try {
        const record = await recordsService.getRecordById(req.params.id);
        res.status(200).json({ status: "success", data: record });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
};

export const createRecord = async (req, res) => {
    try {
        const validatedData = schemas.createMedicalRecordSchema.parse(req.body);
        const record = await recordsService.createRecord(validatedData);
        res.status(201).json({ status: "success", data: record });
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ status: "error", message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateRecord = async (req, res) => {
    try {
        const validatedData = schemas.updateMedicalRecordSchema.parse(req.body);
        const record = await recordsService.updateRecord(req.params.id, validatedData);
        res.status(200).json({ status: "success", data: record });
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ status: "error", message: "Validation error", errors: error.errors });
        }
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteRecord = async (req, res) => {
    try {
        await recordsService.deleteRecord(req.params.id);
        res.status(200).json({ status: "success", message: "Medical Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
