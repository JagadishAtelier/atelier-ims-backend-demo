export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("endusers", "company_id", {
    type: Sequelize.UUID,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("endusers", "company_id");
}