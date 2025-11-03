// src/db/index.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize("hms", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  logging: console.log, // keep for debugging; remove or change in production
  pool: {
    max: 10,       // max connections in pool
    min: 0,
    acquire: 60000, // how long pool will try to get connection before throwing (ms)
    idle: 20000,    // how long a connection can be idle before being released (ms)
  },
  dialectOptions: {
    connectTimeout: 60000, // connection timeout (ms)
  },
  define: {
    // keep underscored false if you use camelCase in model attributes
    // underscored: true,
  },
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Database is Connected"))
  .catch((err) => console.error("❌ Database connection error:", err));

export { sequelize };
