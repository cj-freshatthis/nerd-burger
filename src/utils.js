const mongoose = require('mongoose'),
      dotenv = require('dotenv'),
      { IncomingWebhook } = require('@slack/client'),
      winston = require('winston'),
      Quote = require('./models/quote')

const logger = module.exports.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({'timestamp':true})
  ]
});

const loadEnv = module.exports.loadEnv = () => {
  logger.info('Loading environment variables.')
  dotenv.load()
}

const closeDatabase = module.exports.closeDatabase = () => {
  logger.info('Closing database connection.')
  mongoose.disconnect()
}

const openDatabase = module.exports.openDatabase = () => {
  return new Promise(function(resolve, reject) {
    logger.info('Opening database connection.')
    if (! process.env.MOTIVATOR_DEBUG) {
      loadEnv()
    }
    let debug = process.env.MOTIVATOR_DEBUG === 'true';
    let url = debug ? process.env.DEV_DB_URL : process.env.PROD_DB_URL;
    mongoose.connect(url)
      .then(() => {
        mongoose.connection.on('error', err => {
          reject({success: false, obj: err})
        })

        resolve({success: true, obj: 'Connected!'})
      })
      .catch(err => {
        closeDatabase()
        reject({success: false, obj: err})
      })
  })
}

const dropDatabase = module.exports.dropDatabase = () => {
  let debug = process.env.MOTIVATOR_DEBUG === 'true';
  if (debug) {
    logger.info('Dropping database.')
    mongoose.connection.db.dropDatabase()
  }
}

const sendMessage = module.exports.sendMessage = (message, hook) => {
  return new Promise((resolve, reject) => {
    if (! hook) {
      if (! process.env.SLACK_URL) loadEnv()
      hook = process.env.SLACK_URL
    }
    let notification = new IncomingWebhook(hook)
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
      else resolve({success: true, obj: docs[0]})
    })
  })
}

const addQuote = module.exports.addQuote = (data) => {
  return openDatabase().then((res) => {
    if (! res.success) throw res.obj
    // Create quote object
    let q = new Quote()
    q.text = data.text
    q.author = data.author
    return q.save()
  }).then((res) => {
    logger.info('Quote save success!')
    closeDatabase()
  }).catch((err) => {
    logger.error(err)
    closeDatabase()
  })
}