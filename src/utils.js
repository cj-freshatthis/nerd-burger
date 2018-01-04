const mongoose = require('mongoose'),
      dotenv = require('dotenv'),
      { IncomingWebhook } = require('@slack/client'),
      Quote = require('./models/quote')

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
  return new Promise(function(resolve, reject) {
    if (! process.env.DB_URL) {
      loadEnv()
    }
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

const sendMessage = module.exports.sendMessage = (message, hook) => {
  return new Promise((resolve, reject) => {
    if (! hook) {
      if (! process.env.SLACK_URL) loadEnv()
      hook = process.env.SLACK_URL
    }
    let notification = new IncomingWebhook(hook);
    notification.send(message, (err, res) => {
      if (err) reject({success: false, obj: err})
      else resolve({success: true, obj: res})
    })
  })
}

const getQuote = module.exports.getQuote = () => {
  return new Promise((resolve, reject) => {
    Quote.findRandom().limit(1).exec((err, docs) => {
      if (err) reject({success: false, obj: err})
      else resolve({success: true, obj: docs})
    })
  })
}