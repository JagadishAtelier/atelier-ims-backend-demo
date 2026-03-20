// services/vendor.service.js
import Vendor from "../models/vendor.models.js";
import { Op } from "sequelize";

const vendorService = {
  // ✅ Create a new vendor
async createVendor(data, company_id) {
  data.company_id = company_id; // ✅ attach company_id

  if (data.gst_number) {
    const gstExists = await Vendor.findOne({ 
      where: { 
        gst_number: data.gst_number,
        company_id // ✅ check within company
      } 
    });
    if (gstExists) {
      throw new Error("Vendor with this GST number already exists.");
    }
  }

  if (data.email) {
    const emailExists = await Vendor.findOne({ 
      where: { 
        email: data.email,
        company_id // ✅
      } 
    });
    if (emailExists) {
      throw new Error("Vendor with this email already exists.");
    }
  }

  return await Vendor.create(data);
},

  // ✅ Get all vendors with filters and pagination
async getAllVendors({ filters = {}, limit = 10, offset = 0, company_id } = {}) {
  const where = { 
    is_active: true,
    company_id // ✅ IMPORTANT
  };

  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${filters.search}%` } },
      { contact_person: { [Op.like]: `%${filters.search}%` } },
      { phone: { [Op.like]: `%${filters.search}%` } },
    ];
  }

  if (filters.status) where.status = filters.status;
  if (filters.gst_number) where.gst_number = filters.gst_number;

  const { count, rows } = await Vendor.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    total: count,
    page: Math.floor(offset / limit) + 1,
    limit,
    data: rows,
  };
},

  // ✅ Get vendor by ID
async getVendorById(id, company_id) {
  const vendor = await Vendor.findOne({
    where: { id, company_id, is_active: true } // ✅
  });

  if (!vendor) throw new Error("Vendor not found or inactive.");
  return vendor;
},

  // ✅ Update vendor
async updateVendor(id, data, company_id) {
  const vendor = await Vendor.findOne({
    where: { id, company_id } // ✅
  });

  if (!vendor) throw new Error("Vendor not found");

  if (data.gst_number && data.gst_number !== vendor.gst_number) {
    const gstExists = await Vendor.findOne({
      where: { gst_number: data.gst_number, company_id } // ✅
    });
    if (gstExists) throw new Error("Another vendor with this GST number already exists.");
  }

  if (data.email && data.email !== vendor.email) {
    const emailExists = await Vendor.findOne({
      where: { email: data.email, company_id } // ✅
    });
    if (emailExists) throw new Error("Another vendor with this email already exists.");
  }

  await vendor.update(data);
  return vendor;
},

  // ✅ Soft delete vendor
async deleteVendor(id, deletedBy = {}, company_id) {
  const vendor = await Vendor.findOne({
    where: { id, company_id } // ✅
  });

  if (!vendor) throw new Error("Vendor not found");

  vendor.is_active = false;
  vendor.status = "inactive";
  vendor.deleted_by = deletedBy.id || null;
  vendor.deleted_by_name = deletedBy.name || null;
  vendor.deleted_by_email = deletedBy.email || null;

  await vendor.save();

  return { message: "Vendor soft deleted successfully" };
},

  // ✅ Restore vendor (optional)
  async restoreVendor(id) {
    const vendor = await Vendor.findByPk(id);
    if (!vendor) throw new Error("Vendor not found");

    vendor.is_active = true;
    vendor.status = "active";
    await vendor.save();

    return { message: "Vendor restored successfully" };
  },
};

export default vendorService;
