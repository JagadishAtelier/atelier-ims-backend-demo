// controllers/billing.controller.js
import billingService from "../service/billing.service.js";

const billingController = {
  // ✅ Create new Billing with items
// controllers/billing.controller.js

async create(req, res) {
  try {
    const data = req.body;

    // ✅ Attach company_id from token
    data.company_id = req.company_id;

    if (req.user) {
      data.created_by = req.user.id;
      data.created_by_name = req.user.username || req.user.name;
      data.created_by_email = req.user.email;
    }

    const billing = await billingService.createBillingWithItems(data);

    return res.status(201).json({
      message: "Billing created successfully",
      data: billing,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
},

  // ✅ Get all Billings with filters + pagination
// ✅ GET ALL
async getAll(req, res) {
  try {
    let { page = 1, limit = 10, ...filters } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = (page - 1) * limit;

    // ✅ inject company filter
    filters.company_id = req.company_id;

    const result = await billingService.getAllBillings({
      filters,
      limit,
      offset,
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
},

  // ✅ Get Billing by ID (with items)
// ✅ GET BY ID
async getById(req, res) {
  try {
    const billing = await billingService.getBillingById(
      req.params.id,
      req.company_id
    );

    if (!billing) {
      return res.status(404).json({ error: "Billing not found" });
    }

    return res.json(billing);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
},

  // ✅ Update Billing (and items if provided)
// ✅ UPDATE
async update(req, res) {
  try {
    const data = req.body;

    data.company_id = req.company_id;

    if (req.user) {
      data.updated_by = req.user.id;
      data.updated_by_name = req.user.username || req.user.name;
      data.updated_by_email = req.user.email;
    }

    const billing = await billingService.updateBillingWithItems(
      req.params.id,
      data,
      req.company_id
    );

    if (!billing) {
      return res.status(404).json({ error: "Billing not found" });
    }

    return res.json({
      message: "Billing updated successfully",
      data: billing,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
},

  // ✅ Delete Billing (soft delete billing + items)
// ✅ DELETE
async delete(req, res) {
  try {
    const billing = await billingService.getBillingById(
      req.params.id,
      req.company_id
    );

    if (!billing) {
      return res.status(404).json({ error: "Billing not found" });
    }

    const result = await billingService.deleteBilling(
      req.params.id,
      req.user || {},
      req.company_id
    );

    return res.json({
      message: "Billing deleted successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
},
};

export default billingController;
