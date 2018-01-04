const mongoose = require('mongoose'),
      dotenv = require('dotenv')

const loadEnv = module.exports.loadEnv = () => {
  console.log('Loading environment variables.')
  dotenv.load()
}

const closeDatabase = module.exports.closeDatabase = () => {
  console.log('Closing database connection.')
  mongoose.disconnect()
}

const openDatabase = module.exports.openDatabase = () => {
  console.log('Opening database connection.')
  if (! process.env.DB_URL) {
    loadEnv()
  }
  return new Promise(function(resolve, reject) {
    mongoose.connect(process.env.DB_URL)
      .then(() => {
        mongoose.connection.on('error', err => {
          reject(err)
        })

        resolve('Connected!')
      })
      .catch(err => {
        closeDatabase()
        reject(err)
      })
  })
}

const dropDatabase = module.exports.dropDatabase = () => {
  console.log('Dropping database.')
  mongoose.connection.db.dropDatabase()
}