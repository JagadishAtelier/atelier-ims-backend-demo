export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("endusers", "demo_start", {
    type: Sequelize.DATE,
    allowNull: true,
  });

  await queryInterface.addColumn("endusers", "demo_end", {
    type: Sequelize.DATE,
    allowNull: true,
  });

  await queryInterface.addColumn("endusers", "demo_expired", {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("endusers", "demo_start");
  await queryInterface.removeColumn("endusers", "demo_end");
  await queryInterface.removeColumn("endusers", "demo_expired");
}