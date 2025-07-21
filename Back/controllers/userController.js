const User = require("../models/User");
const { Op } = require("sequelize");

// Get all employees (admin only)
const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", department = "" } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {
      role: "employee",
    };

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (department) {
      whereClause.department = { [Op.iLike]: `%${department}%` };
    }

    const { count, rows: employees } = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        employees,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all employees error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching employees",
    });
  }
};

// Get employee by ID (admin only)
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({
      where: {
        id,
        role: "employee",
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error("Get employee by ID error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching employee",
    });
  }
};

// Update employee (admin only)
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      department,
      position,
      salary,
      role,
      is_admin,
    } = req.body;

    const employee = await User.findOne({
      where: {
        id,
        role: "employee",
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.update({
      firstName: firstName || employee.firstName,
      lastName: lastName || employee.lastName,
      department: department || employee.department,
      position: position || employee.position,
      salary: salary || employee.salary,
      role: role || employee.role,
      is_admin: is_admin || employee.is_admin,
    });

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating employee",
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        salary: user.salary,
        department: user.department,
        is_admin: user.is_admin,
        imageurl: user.imageurl,
        position: user.position,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get dashboard stats (admin only)
const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await User.count({
      where: {
        role: "employee",
      },
    });

    const totalAdmins = await User.count({
      where: {
        role: "admin",
      },
    });

    const departmentStats = await User.findAll({
      attributes: [
        "department",
        [User.sequelize.fn("COUNT", User.sequelize.col("id")), "count"],
      ],
      where: {
        department: {
          [Op.not]: null,
        },
      },
      group: ["department"],
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalEmployees,
          totalAdmins,
          totalUsers: totalEmployees + totalAdmins,
          departmentBreakdown: departmentStats,
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching dashboard stats",
    });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", department = "" } = req.query;
    const offset = (page - 1) * limit;

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (department) {
      whereClause.department = { [Op.iLike]: `%${department}%` };
    }

    const { count, rows: employees } = await User.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["id", "DESC"]],
    });

    res.json({
      success: true,
      data: {
        employees,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all employees error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching employees",
    });
  }
};
const updateallusers = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      department,
      position,
      salary,
      role,
      is_admin,
      imageurl,
    } = req.body;

    const employee = await User.findOne({ where: { id } });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    await employee.update({
      firstName: firstName || employee.firstName,
      lastName: lastName || employee.lastName,
      department: department || employee.department,
      position: position || employee.position,
      salary: salary || employee.salary,
      role: role || employee.role,
      is_admin: is_admin || employee.is_admin,
      imageurl: imageurl || employee.imageurl,
    });

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error("Update employee error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating employee",
    });
  }
};
const getallusersId = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({ where: { id } });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.json({
      success: true,
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error("Get employee by ID error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching employee",
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  getDashboardStats,
  getProfile,
  getAllUsers,
  getallusersId,
  updateallusers,
};
