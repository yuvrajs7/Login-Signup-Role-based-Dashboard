const express = require("express");
const {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  getDashboardStats,
  getProfile,
  getAllUsers,
  updateallusers,
  getallusersId,
} = require("../controllers/userController");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Admin routes
router.get("/employees", auth, adminAuth, getAllEmployees);
router.get("/employees/:id", auth, adminAuth, getEmployeeById);
router.get("/allusers/:id", auth, getallusersId);
router.put("/employees/:id", auth, adminAuth, updateEmployee);
router.put("/allusers/:id", auth, updateallusers);
router.get("/dashboard/stats", auth, adminAuth, getDashboardStats);
router.get("/profile", auth, getProfile);
router.get("/allusers", auth, adminAuth, getAllUsers);

module.exports = router;
