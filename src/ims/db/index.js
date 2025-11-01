import { Sequelize  } from "sequelize"; 

const sequelize = new Sequelize("mysql://u265115582_parthiban:Parthiban2025@82.112.229.246/u265115582_billing");

// const sequelize = new Sequelize("mysql://root:root@localhost/ims_db");

sequelize.authenticate().then((data)=> console.log("Database is Connected")).catch((err)=> console.log(`Error ${err}`))


 export { sequelize };




// import { Sequelize } from "sequelize";

// const sequelize = new Sequelize("hms", "ramya", "ramya", {
//   host: "192.168.1.150",
//   port: 3306,
//   dialect: "mysql",
// });

// sequelize
//   .authenticate()
//   .then(() => console.log("Database is Connected"))
//   .catch((err) => console.error(`Database connection error: ${err}`));


// export { sequelize };




