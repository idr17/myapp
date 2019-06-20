module.exports = {
  PORT: process.env.PORT || 3000,
  DB: 'mongodb://localhost:27017/auth',
  BCRYPT_SALT_I: 10,
  JWT_SUPERSECRET: 'supersecret',
  TRANSACTION_TYPE: {
    CR: 'CR',
    DB: 'DB',
    TRANSFER: 'TRANSFER'
  }
}