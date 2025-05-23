const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  retry: {
    match: [
      /Deadlock/i,
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeConnectionTimedOutError/,
      /SequelizeConnectionAcquireTimeoutError/,
      /ETIMEDOUT/
    ],
    max: 3
  },
  logging: console.log // Enable logging for debugging
});

const testConnection = async () => {
  try {
    console.log('Attempting to connect to database with URL:', process.env.MYSQL_URL);
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Test query to verify full functionality
    try {
      await sequelize.query('SELECT 1+1 as result');
      console.log('Database query test successful');
    } catch (queryError) {
      console.error('Database query test failed:', queryError);
    }
  } catch (error) {
    console.error('Unable to connect to the database:', {
      message: error.message,
      code: error.original?.code,
      errno: error.original?.errno,
      sqlState: error.original?.sqlState,
      sqlMessage: error.original?.sqlMessage,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = { sequelize, testConnection }; 