const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/ProductRoutes");
const branchRoutes = require("./src/routes/branchRoutes");
const supplierRoutes = require("./src/routes/supplierRoutes");
const clientRoutes = require("./src/routes/clientRoutes");
const staffPositionRoutes = require('./src/routes/staffPositionRoutes');
const brandRoutes = require('./src/routes/brandRoutes');
const parentProductCategoryRoutes = require('./src/routes/parentProductCategoryRoutes');
const productCategoryRoutes = require('./src/routes/ProductCategoryRoutes');
const UnitRoutes = require('./src/routes/UnitRoutes');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
//enable cors
app.use(cors());

// DB Connection
connectDB();

// Api Endpoints
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/staff_positions", staffPositionRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/parent_product_categories", parentProductCategoryRoutes);
app.use("/api/product_categories", productCategoryRoutes);
app.use("/api/units", UnitRoutes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
