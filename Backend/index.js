require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const newsDashboard=require('./src/config/newsDashboard')
const {adminsBlogTable,writersDashboardTable, newsDashboardTable,adminLiveVideo,adminmagazine,adminDailyPulse}=require('./src/setupTables/createAdminTables')
const {connectRedis}=require('../Backend/src/config/redisClient.js')
const adminRouter=require('./src/routes/adminRoute')
const newsRoute=require('./src/routes/newsRoute')
// const cookieParser = require('cookie-parser');
app.use(cookieParser());

const ADMIN_BACKEND_PORT = process.env.ADMIN_BACKEND_PORT;
app.use(express.json());
adminsBlogTable()
writersDashboardTable()
newsDashboardTable()
adminLiveVideo()
adminmagazine()  
adminDailyPulse() 
// app.use(cors());
app.use(
  cors({
    origin:[ "http://localhost:5173","http://localhost:3000"],
     // Your frontend URL
    credentials: true,               // Allow cookies and auth headers
  })
);

app.use('/api/admin',adminRouter)
app.use('/api/news',newsRoute)
const startServer = async () => {
  try {
    await connectRedis(); // wait for Redis to connect
    app.listen(ADMIN_BACKEND_PORT, () => {
      console.log(`✅ Server running on port ${ADMIN_BACKEND_PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
  }
};

startServer();