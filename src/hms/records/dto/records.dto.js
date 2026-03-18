import { z } from "zod";

export const createRecordTypeSchema = z.object({
    name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters").max(255),
    category: z.string().optional().default("general"),
    templateRequired: z.boolean().optional().default(true),
    is_active: z.boolean().optional().default(true),
    status: z.string().optional().default("Active"),

    created_by: z.string().uuid().optional(),
    created_by_name: z.string().optional(),
    created_by_email: z.string().email().optional(),
});

export const updateRecordTypeSchema = z.object({
    name: z.string().min(2).max(255).optional(),
    category: z.string().optional(),
    templateRequired: z.boolean().optional(),
    is_active: z.boolean().optional(),
    status: z.string().optional(),

    updated_by: z.string().uuid().optional(),
    updated_by_name: z.string().optional(),
    updated_by_email: z.string().email().optional(),
});

export const createTemplateSchema = z.object({
    name: z.string({ required_error: "Template name is required" }).min(2, "Name must be at least 2 characters").max(255),
    record_type: z.string({ required_error: "Record type is required" }).max(255),
    version: z.number().int().optional().default(1),
    fields: z.array(z.any()).optional().default([]), // array of field definition objects
    is_active: z.boolean().optional().default(true),

    created_by: z.string().uuid().optional(),
    created_by_name: z.string().optional(),
    created_by_email: z.string().email().optional(),
});

export const updateTemplateSchema = z.object({
    name: z.string().min(2).max(255).optional(),
    record_type: z.string().max(255).optional(),
    version: z.number().int().optional(),
    fields: z.array(z.any()).optional(),
    is_active: z.boolean().optional(),

    updated_by: z.string().uuid().optional(),
    updated_by_name: z.string().optional(),
    updated_by_email: z.string().email().optional(),
});

export const createMedicalRecordSchema = z.object({
    client_id: z.string().uuid().optional(),
    pet_id: z.string().uuid({ required_error: "Pet ID is required" }),
    appointment_id: z.string().uuid().optional(),
    template_id: z.string().uuid({ required_error: "Template ID is required" }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
    record_type: z.string({ required_error: "Record type is required" }).max(255),
    description: z.string().optional(),
    diagnosis: z.string().optional(),
    field_values: z.record(z.any()).optional().default({}), // dynamic object with field values
    is_active: z.boolean().optional().default(true),
    status: z.string().optional().default("Active"),

    created_by: z.string().uuid().optional(),
    created_by_name: z.string().optional(),
    created_by_email: z.string().email().optional(),
});

export const updateMedicalRecordSchema = z.object({
    client_id: z.string().uuid().optional(),
    pet_id: z.string().uuid().optional(),
    appointment_id: z.string().uuid().optional(),
    template_id: z.string().uuid().optional(),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }).optional(),
    record_type: z.string().max(255).optional(),
    description: z.string().optional(),
    diagnosis: z.string().optional(),
    field_values: z.record(z.any()).optional(),
    is_active: z.boolean().optional(),
    status: z.string().optional(),

    updated_by: z.string().uuid().optional(),
    updated_by_name: z.string().optional(),
    updated_by_email: z.string().email().optional(),
});
