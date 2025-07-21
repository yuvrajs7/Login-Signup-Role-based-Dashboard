const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  host: 'ep-orange-rice-a1ka4l1e-pooler.ap-southeast-1.aws.neon.tech',
  port: 5432,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

module.exports=sequelize;