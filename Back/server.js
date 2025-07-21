const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const imageroute = require("./routes/upload");
const { auth, adminAuth } = require("./middleware/auth"); // ✅ Destructure properly

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ Make sure this matches your frontend's port
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", imageroute);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});
app.get("/", (req, res) => {
  res.json("Api Working");
});

// Debug route (all users) — secured in production
app.get("/api/debug/users", async (req, res) => {
  try {
    const User = require("./models/User");
    const users = await User.findAll();
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test route that shows role-based data from JWT
app.get("/api/debug/role-test", auth, (req, res) => {
  res.json({
    success: true,
    message: `Hello ${req.user.firstName || "User"}!`,
    your_role: req.user.role,
    can_manage_employees: req.user.role === "admin",
    user_data: req.user,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
  });
});

// 404 fallback
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server and connect to DB
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    await sequelize.sync({ force: false });
    console.log("✅ Database synchronized.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
