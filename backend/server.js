const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
const cors = require('cors');
const { connectDB } = require('./libs/db.js');
const path = require("path"); // ✅ path module is fine

// ❌ Don't redefine __dirname in CommonJS, it's already available

const port = process.env.PORT || 8000;

const app = express();
dotenv.config();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require('./routes/user.route.js');
const inventoryRoutes = require('./routes/inventory.route.js');
const Carregisteration = require('./routes/registeration.route.js');
const contactRoutes = require('./routes/contact.route.js');
const blogRoutes = require('./routes/blogs.route.js');
const orderRoutes = require('./routes/order.route.js');
const shipmentRoutes = require('./routes/shipment.route.js');
const wishlistRoutes = require('./routes/wishlist.route.js');
const wireRoutes = require('./routes/wire.route.js');
const docsRoutes = require('./routes/docs.route.js');
const walletRoutes = require('./routes/wallet.route.js')
const EsimationRoute = require('./routes/estimation.route.js')
const employeeRoutes = require('./routes/employee.route.js')
const rentRoutes = require("./routes/rent.route.js")
const TransactionRoutes = require('./routes/transaction.route.js')

app.get('/', (req, res) => {
  res.send('Hello Worldaaa');
});

app.use('/api/users/', authRoutes);
app.use('/api/inventory/', inventoryRoutes);
app.use('/api/registeration/', Carregisteration);
app.use('/api/contact/', contactRoutes);
app.use('/api/blogs/', blogRoutes);
app.use('/api/order/', orderRoutes);
app.use('/api/shipment/', shipmentRoutes);
app.use('/api/wishlist/', wishlistRoutes);
app.use('/api/wire/', wireRoutes);
app.use('/api/docs/', docsRoutes);
app.use('/api/wallet/', walletRoutes);
app.use('/api/estimation/',EsimationRoute)
app.use('/api/employee/',employeeRoutes)
app.use('/api/rentassets',rentRoutes)
app.use('/api/transaction',TransactionRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});

