import { sequelize } from "../../../db/index.js";
import { RecordType, RecordTemplate, MedicalRecord } from "../models/records.models.js";
import { Op } from "sequelize";
import Patients from "../../patients/models/patients.models.js";
import Appointments from "../../appointments/models/appointments.models.js";

// ======================= RECORD TYPES =======================

export const getAllRecordTypes = async (query) => {
    let whereClause = {};

    if (query.name) {
        whereClause.name = {
            [Op.iLike]: `%${query.name}%`,
        };
    }

    if (query.is_active !== undefined) {
        whereClause.is_active = query.is_active === "true";
    }

    const { count, rows } = await RecordType.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: RecordTemplate,
                as: "templates",
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return { total: count, data: rows };
};

export const getRecordTypeById = async (id) => {
    const recordType = await RecordType.findByPk(id, {
        include: [
            {
                model: RecordTemplate,
                as: "templates",
            },
        ],
    });

    if (!recordType) {
        throw new Error("Record Type not found");
    }

    return recordType;
};

export const createRecordType = async (typeData) => {
    return await RecordType.create(typeData);
};

export const updateRecordType = async (id, updateData) => {
    const recordType = await RecordType.findByPk(id);

    if (!recordType) throw new Error("Record Type not found");
    if (recordType.is_default) {
        throw new Error("Cannot update a system default record type");
    }

    if (updateData.is_default !== undefined) {
        delete updateData.is_default;
    }

    await recordType.update(updateData);
    return recordType;
};

export const deleteRecordType = async (id) => {
    const recordType = await RecordType.findByPk(id);

    if (!recordType) throw new Error("Record Type not found");
    if (recordType.is_default) {
        throw new Error("Cannot delete a system default record type");
    }

    await recordType.destroy();
    return { id };
};

// ======================= RECORD TEMPLATES =======================

export const getAllTemplates = async (query) => {
    let whereClause = {};

    if (query.record_type_id) {
        whereClause.record_type_id = query.record_type_id;
    }

    if (query.is_active !== undefined) {
        whereClause.is_active = query.is_active === "true";
    }

    const { count, rows } = await RecordTemplate.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: RecordType,
                as: "record_type",
                attributes: ["id", "name"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return { total: count, data: rows };
};

export const getTemplateById = async (id) => {
    const template = await RecordTemplate.findByPk(id, {
        include: [
            {
                model: RecordType,
                as: "record_type",
            },
        ],
    });

    if (!template) throw new Error("Template not found");

    return template;
};

export const createTemplate = async (templateData) => {
    return await RecordTemplate.create(templateData);
};

export const updateTemplate = async (id, updateData) => {
    const template = await RecordTemplate.findByPk(id);

    if (!template) throw new Error("Template not found");
    if (template.is_default) {
        throw new Error("Cannot update a system default record template");
    }

    if (updateData.is_default !== undefined) {
        delete updateData.is_default;
    }

    await template.update(updateData);
    return template;
};

export const deleteTemplate = async (id) => {
    const template = await RecordTemplate.findByPk(id);

    if (!template) throw new Error("Template not found");
    if (template.is_default) {
        throw new Error("Cannot delete a system default record template");
    }

    const inUseCount = await MedicalRecord.count({
        where: { template_id: id },
    });

    if (inUseCount > 0) {
        throw new Error("Template is used in medical records");
    }

    await template.destroy();
    return { id };
};

// ======================= MEDICAL RECORDS =======================

export const getAllRecords = async (query) => {
    let whereClause = {};

    if (query.patient_id) {
        whereClause.patient_id = query.patient_id;
    }

    if (query.appointment_id) {
        whereClause.appointment_id = query.appointment_id;
    }

    const { count, rows } = await MedicalRecord.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: Patients,
                as: "patient",
                attributes: ["id", "first_name", "last_name", "patient_code"],
            },
            {
                model: RecordTemplate,
                as: "template",
                attributes: ["id", "name"],
            },
            {
                model: RecordType,
                as: "record_type",
                attributes: ["id", "name"],
            },
            {
                model: Appointments,
                as: "appointment",
                attributes: ["id", "appointment_no", "scheduled_at", "status"],
            },
        ],
        order: [["date", "DESC"], ["createdAt", "DESC"]],
    });

    return { total: count, data: rows };
};

export const getRecordById = async (id) => {
    const record = await MedicalRecord.findByPk(id, {
        include: [
            {
                model: Patients,
                as: "patient",
            },
            {
                model: RecordTemplate,
                as: "template",
            },
            {
                model: RecordType,
                as: "record_type",
            },
            {
                model: Appointments,
                as: "appointment",
            },
        ],
    });

    if (!record) throw new Error("Medical Record not found");

    return record;
};

export const createRecord = async (recordData) => {
    return await MedicalRecord.create(recordData);
};

export const updateRecord = async (id, updateData) => {
    const record = await MedicalRecord.findByPk(id);

    if (!record) throw new Error("Medical Record not found");

    await record.update(updateData);
    return record;
};

export const deleteRecord = async (id) => {
    const record = await MedicalRecord.findByPk(id);

    if (!record) throw new Error("Medical Record not found");

    await record.destroy();
    return { id };
};

export default {
    getAllRecordTypes,
    getRecordTypeById,
    createRecordType,
    updateRecordType,
    deleteRecordType,
    getAllTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getAllRecords,
    getRecordById,
    createRecord,
    updateRecord,
    deleteRecord,
};