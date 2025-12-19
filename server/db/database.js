require ('dotenv').config()
module.exports={
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "postgres"
  },
  production: {
    'username': process.env.DB_USER_PROD,
    'password': process.env.DB_PASS_PROD,
    'database': process.env.DB_NAME_PROD,
    'host': process.env.DB_HOST_PROD,
    'use_env_variable': 'DB_URL',
    'dialectOptions': {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    'dialect': 'postgres',
  },
}
