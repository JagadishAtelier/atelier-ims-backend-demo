import Category from "../models/category.model.js";
import { Op } from "sequelize";

const categoryService = {
  async createCategory(data, company_id) {
    data.company_id = company_id;
    return await Category.create(data);
  },

  async getAllCategories({ filters = {}, limit = 10, offset = 0, company_id } = {}) {
    const where = { is_active: true, company_id };

    if (filters.search) {
      where[Op.or] = [
        { category_name: { [Op.like]: `%${filters.search}%` } },
        { description: { [Op.like]: `%${filters.search}%` } },
      ];
    }
    if (filters.category_name) where.category_name = filters.category_name;
    if (filters.status !== undefined) where.is_active = filters.status;

    const { count, rows } = await Category.findAndCountAll({
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

  async getCategoryById(id, company_id) {
    const category = await Category.findOne({ where: { id, company_id } });
    if (!category) throw new Error("Category not found");
    return category;
  },

  async updateCategory(id, data, company_id) {
    const category = await Category.findOne({ where: { id, company_id } });
    if (!category) throw new Error("Category not found");
    await category.update(data);
    return category;
  },

  async deleteCategory(id, company_id) {
    const category = await Category.findOne({ where: { id, company_id } });
    if (!category) throw new Error("Category not found");

    category.is_active = false;
    await category.save();
    return { message: "Category soft deleted successfully" };
  },

  async findByName(category_name, company_id) {
    return await Category.findOne({ where: { category_name, company_id } });
  },

  async getLastCategory(company_id) {
    return await Category.findOne({
      where: { company_id },
      order: [["createdAt", "DESC"]],
    });
  },
};

export default categoryService;