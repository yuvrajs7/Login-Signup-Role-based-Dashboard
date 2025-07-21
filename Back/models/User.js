const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    role: {
      type: DataTypes.ENUM("employee", "admin"),
      defaultValue: "employee",
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_admin",
    },
    imageurl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false },
);

// Instance method to check password
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user data without password
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  return values;
};
User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 10);
  if (user.changed("role") || user.isNewRecord) {
    user.is_admin = user.role === "admin";
  }
});

module.exports = User;
