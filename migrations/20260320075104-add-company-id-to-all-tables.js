const tables = ["billing", "billing_items", "inward", "inward_items","orders","order_items","subcategory","products","category"];

export async function up(queryInterface, Sequelize) {
  for (const table of tables) {
    try {
      await queryInterface.addColumn(table, "company_id", {
        type: Sequelize.UUID,
        allowNull: true,
      });
      console.log(`Added company_id to ${table}`);
    } catch (err) {
      console.error(`Error in ${table}:`, err.message);
    }
  }
}

export async function down(queryInterface, Sequelize) {
  for (const table of tables) {
    try {
      await queryInterface.removeColumn(table, "company_id");
      console.log(`Removed company_id from ${table}`);
    } catch (err) {
      console.error(`Error in ${table}:`, err.message);
    }
  }
}