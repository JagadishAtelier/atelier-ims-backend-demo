import { sequelize } from "../../../db/index.js";
import { DataTypes } from "sequelize";
import Patients from "../../patients/models/patients.models.js";
import Appointments from "../../appointments/models/appointments.models.js";

/* =========================
   Record Type Model
========================= */
export const RecordType = sequelize.define(
    "RecordType",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "general",
        },
        templateRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING(50),
            defaultValue: "Active",
            allowNull: false,
        },

        // Audit
        created_by: { type: DataTypes.UUID },
        updated_by: { type: DataTypes.UUID },
        deleted_by: { type: DataTypes.UUID },

        created_by_name: { type: DataTypes.STRING },
        updated_by_name: { type: DataTypes.STRING },
        deleted_by_name: { type: DataTypes.STRING },

        created_by_email: { type: DataTypes.STRING },
        updated_by_email: { type: DataTypes.STRING },
        deleted_by_email: { type: DataTypes.STRING },
    },
    {
        tableName: "record_types",
        timestamps: true,
    }
);

/* =========================
   Record Template Model
========================= */
export const RecordTemplate = sequelize.define(
    "RecordTemplate",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        // 🔥 Normalized (better than string)
        record_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "record_types",
                key: "id",
            },
        },

        version: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },

        fields: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
        },

        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        // Audit
        created_by: { type: DataTypes.UUID },
        updated_by: { type: DataTypes.UUID },
        deleted_by: { type: DataTypes.UUID },

        created_by_name: { type: DataTypes.STRING },
        updated_by_name: { type: DataTypes.STRING },
        deleted_by_name: { type: DataTypes.STRING },

        created_by_email: { type: DataTypes.STRING },
        updated_by_email: { type: DataTypes.STRING },
        deleted_by_email: { type: DataTypes.STRING },
    },
    {
        tableName: "record_templates",
        timestamps: true,
    }
);

/* =========================
   Medical Record Model
========================= */
export const MedicalRecord = sequelize.define(
    "MedicalRecord",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        patient_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "patients",
                key: "id",
            },
            onDelete: "CASCADE",
        },

        appointment_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: "appointments",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },

        template_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "record_templates",
                key: "id",
            },
        },

        // 🔥 Optional normalized type
        record_type_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "record_types",
                key: "id",
            },
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
        },

        diagnosis: {
            type: DataTypes.TEXT,
        },

        field_values: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        status: {
            type: DataTypes.STRING(50),
            defaultValue: "Active",
        },

        // Audit
        created_by: { type: DataTypes.UUID },
        updated_by: { type: DataTypes.UUID },
        deleted_by: { type: DataTypes.UUID },

        created_by_name: { type: DataTypes.STRING },
        updated_by_name: { type: DataTypes.STRING },
        deleted_by_name: { type: DataTypes.STRING },

        created_by_email: { type: DataTypes.STRING },
        updated_by_email: { type: DataTypes.STRING },
        deleted_by_email: { type: DataTypes.STRING },
    },
    {
        tableName: "medical_records",
        timestamps: true,
    }
);

/* =========================
   Associations
========================= */

// Patient ↔ Medical Records
MedicalRecord.belongsTo(Patients, {
    foreignKey: "patient_id",
    as: "patient",
});

Patients.hasMany(MedicalRecord, {
    foreignKey: "patient_id",
    as: "medical_records",
});

// Template ↔ Medical Records
MedicalRecord.belongsTo(RecordTemplate, {
    foreignKey: "template_id",
    as: "template",
});

RecordTemplate.hasMany(MedicalRecord, {
    foreignKey: "template_id",
    as: "medical_records",
});

// RecordType ↔ Template
RecordTemplate.belongsTo(RecordType, {
    foreignKey: "record_type_id",
    as: "record_type",
});

RecordType.hasMany(RecordTemplate, {
    foreignKey: "record_type_id",
    as: "templates",
});

// RecordType ↔ MedicalRecord
MedicalRecord.belongsTo(RecordType, {
    foreignKey: "record_type_id",
    as: "record_type",
});

RecordType.hasMany(MedicalRecord, {
    foreignKey: "record_type_id",
    as: "medical_records",
});

// Appointment ↔ MedicalRecord
MedicalRecord.belongsTo(Appointments, {
    foreignKey: "appointment_id",
    as: "appointment",
});

Appointments.hasMany(MedicalRecord, {
    foreignKey: "appointment_id",
    as: "medical_records",
});

export default {
    RecordType,
    RecordTemplate,
    MedicalRecord,
};