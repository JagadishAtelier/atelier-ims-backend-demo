// import { Sequelize  } from "sequelize"; 

// const sequelize = new Sequelize("mysql://root:root@192.168.1.150/hms");

// sequelize.authenticate().then((data)=> console.log("Database is Connected")).catch((err)=> console.log(`Error ${err}`))


// export { sequelize };




import { Sequelize } from "sequelize";

const sequelize = new Sequelize("mysql://u265115582_myimsdatabase:Myimsdatabase1@82.112.229.246/u265115582_MyIMSDatabase");
// import categorySchema from "../ims/product/models/category.model.js";
// import subCategorySchema from "../ims/product/models/subcategory.models.js";
// import productSchema from "../ims/product/models/product.model.js";
// import billingSchema from "../ims/billing/models/billing.models.js";
// import billingItemSchema from "../ims/billing/models/billingiteam.models.js";
// import inwardSchema from "../ims/inward/models/inward.model.js";
// import inwardItemSchema from "../ims/inward/models/inwarditeam.model.js";
// import orderSchema from "../ims/order/models/order.models.js";
// import orderItemSchema from "../ims/order/models/orderiteam.models.js";
import returnSchema from "../ims/return/models/return.models.js";
import returnItemSchema from "../ims/return/models/returniteams.models.js";
// import stockSchema from "../ims/stock/models/stock.models.js";
// import vendorSchema from "../ims/vendor/models/vendor.models.js";
// const sequelize = new Sequelize("mysql://root:root@localhost/hms");

sequelize
  .authenticate()
  .then(() => console.log("Database is Connected"))
  .catch((err) => console.error(`Database connection error: ${err}`));


export { sequelize };




