// services/billing.service.js
import { Op } from "sequelize";
import { sequelize } from "../../../db/index.js";
import Billing from "../models/billing.models.js";
import BillingItem from "../models/billingiteam.models.js";
import Product from "../../product/models/product.model.js";
import Stock from "../../stock/models/stock.models.js";
import Inward from "../../inward/models/inward.model.js";
import InwardItem from "../../inward/models/inwarditeam.model.js";
import "../models/associations.js";

const billingService = {
  // ✅ Create Billing with Items
  async createBillingWithItems(data) {
  return await sequelize.transaction(async (t) => {
    // 1️⃣ Generate billing_no automatically
    const lastBilling = await Billing.findOne({
      order: [["createdAt", "DESC"]],
      transaction: t,
    });
    const lastNo = lastBilling
      ? parseInt(lastBilling.billing_no.split("-")[1])
      : 1000;
    const billingNo = `BILL-${lastNo + 1}`;

    // 2️⃣ Validate items
    if (!data.items || data.items.length === 0) {
      throw new Error("Billing must have at least one item");
    }

    let subtotal = 0;
    let totalQuantity = 0;
    const itemsToCreate = [];
    const inwardIdsUsed = []; // 🔗 collect all inward ids used across all items

    for (const item of data.items) {
      const product = await Product.findByPk(item.product_id, { transaction: t });
      if (!product) throw new Error(`Product with ID ${item.product_id} not found`);

      let remainingQty = Number(item.quantity || 0);
      if (remainingQty <= 0) throw new Error("Invalid quantity");

      let totalCost = 0;
      const usedInwardItemIds = [];

      // 3️⃣ FIFO: Find InwardItems with unused_quantity > 0 (oldest first)
      const inwardItems = await InwardItem.findAll({
        where: {
          product_id: item.product_id,
          unused_quantity: { [Op.gt]: 0 },
        },
        order: [["createdAt", "ASC"]],
        transaction: t,
      });

      for (const inwardItem of inwardItems) {
        if (remainingQty <= 0) break;

        const available = Number(inwardItem.unused_quantity || 0);
        if (available <= 0) continue;

        const takeQty = Math.min(available, remainingQty);

        // 🔄 Update inwardItem quantities
        const newUnused = available - takeQty;
        const newBillingQty = (Number(inwardItem.billing_quantity || 0) + takeQty);

        await inwardItem.update(
          {
            unused_quantity: newUnused,
            billing_quantity: newBillingQty,
          },
          { transaction: t }
        );

        // 🔄 Update parent Inward totals
        if (inwardItem.inward_id) {
          const parentInward = await Inward.findByPk(inwardItem.inward_id, { transaction: t });
          if (parentInward) {
            const newTotalUnused = Math.max((parentInward.total_unused_quantity || 0) - takeQty, 0);
            const newTotalBilling = (parentInward.total_billing_quantity || 0) + takeQty;

            await parentInward.update(
              {
                total_unused_quantity: newTotalUnused,
                total_billing_quantity: newTotalBilling,
              },
              { transaction: t }
            );

            inwardIdsUsed.push(parentInward.id);
          }
        }

        // 💰 Compute cost
        totalCost += takeQty * Number(inwardItem.unit_price || 0);
        usedInwardItemIds.push(inwardItem.id);

        remainingQty -= takeQty;
      }

      if (remainingQty > 0) {
        throw new Error(`Insufficient stock (unused quantity) for product ${item.product_id}`);
      }

      // 🔄 Update Stock
      const stock = await Stock.findOne({
        where: { product_id: item.product_id },
        transaction: t,
      });
      if (!stock) throw new Error(`Stock not found for product ${product.product_name}`);

      const newStockQty = Math.max(Number(stock.quantity || 0) - item.quantity, 0);
      const newBillingQty = (Number(stock.billing_quantity || 0) + item.quantity);

      await stock.update(
        {
          quantity: newStockQty,
          billing_quantity: newBillingQty,
        },
        { transaction: t }
      );

      // 💵 Compute pricing
      const totalPrice = totalCost;
      const unitPrice = totalCost / item.quantity;
      subtotal += totalPrice;
      totalQuantity += item.quantity;

      // 🧾 Prepare BillingItem
      itemsToCreate.push({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: unitPrice,
        discount_amount: item.discount_amount || 0,
        tax_amount: item.tax_amount || 0,
        total_price: totalPrice,
        inward_item_ids: usedInwardItemIds, // traceability
      });
    }

    // 4️⃣ Calculate final totals
    const discountAmount = data.discount_amount || 0;
    const taxAmount = data.tax_amount || 0;
    const totalAmount = subtotal - discountAmount + taxAmount;
    const paidAmount = data.paid_amount || 0;
    const dueAmount = totalAmount - paidAmount;

    // 5️⃣ Create Billing (with inward_id JSON)
    const billing = await Billing.create(
      {
        billing_no: billingNo,
        customer_name: data.customer_name,
        type: data.type,
        billing_date: data.billing_date || new Date(),
        inward_id: inwardIdsUsed, // ✅ JSON array of inward IDs used
        total_quantity: totalQuantity,
        subtotal_amount: subtotal,
        discount_amount: discountAmount,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        paid_amount: paidAmount,
        due_amount: dueAmount,
        payment_method: data.payment_method,
        status: data.status,
        counter_no: data.counter_no || null,
        notes: data.notes || null,
        created_by: data.created_by,
        created_by_name: data.created_by_name,
        created_by_email: data.created_by_email,
      },
      { transaction: t }
    );

    // 6️⃣ Create BillingItems
    const itemsWithBillingId = itemsToCreate.map((it) => ({
      ...it,
      billing_id: billing.id,
    }));

    await BillingItem.bulkCreate(itemsWithBillingId, { transaction: t });

    // 7️⃣ Return Billing with Items
    return await Billing.findByPk(billing.id, {
      include: [{ model: BillingItem, as: "items" }],
      transaction: t,
    });
  });
},


  // ✅ Get All Billings with Filters + Pagination
  async getAllBillings({ filters = {}, limit = 10, offset = 0 } = {}) {
    const where = {};

    if (filters.billing_no) {
      where.billing_no = { [Op.like]: `%${filters.billing_no}%` };
    }
    if (filters.customer_name) {
      where.customer_name = { [Op.like]: `%${filters.customer_name}%` };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.type) {
      where.type = filters.type;
    }
    if (filters.billing_date) {
      where.billing_date = filters.billing_date;
    }

    const { count, rows } = await Billing.findAndCountAll({
      where,
      distinct: true,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: BillingItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "product_name", "product_code", "unit"],
            },
          ],
        },
      ],
    });

    return {
      total: count,
      page: Math.floor(offset / limit) + 1,
      limit,
      data: rows,
    };
  },

  // ✅ Get Billing by ID
  // ✅ Get Billing by ID
async getBillingById(id) {
  return await Billing.findByPk(id, {
    include: [
      {
        model: BillingItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "product_name", "product_code", "unit"],
          },
        ],
      },
    ],
  });
},


  // ✅ Delete Billing (soft delete)
  async deleteBilling(id, user) {
    return await sequelize.transaction(async (t) => {
      const billing = await Billing.findByPk(id, { transaction: t });
      if (!billing) return null;

      await billing.update(
        {
          is_active: false,
          deleted_by: user.id || null,
          deleted_by_name: user.username || user.name || null,
          deleted_by_email: user.email || null,
        },
        { transaction: t }
      );

      return { message: "Billing soft deleted successfully" };
    });
  },
};

export default billingService;
