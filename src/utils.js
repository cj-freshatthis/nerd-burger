const mongoose = require('mongoose'),
      dotenv = require('dotenv'),
      { IncomingWebhook } = require('@slack/client'),
      winston = require('winston'),
      Quote = require('./models/quote')

const logger = module.exports.logger = new winston.Logger({
  transports: [
    new winston.transports.Console({'timestamp': true})
  ]
})

const loadEnv = module.exports.loadEnv = () => {
  logger.info('Loading environment variables.')
  try {
    dotenv.load()
  } catch (e) {
    // Missing .env file - ignore
  }
  logger.info('MOTIVATOR_DEBUG = ' + process.env.MOTIVATOR_DEBUG)
}

const closeDatabase = module.exports.closeDatabase = () => {
  logger.info('Closing database connection.')
  mongoose.disconnect()
}

const openDatabase = module.exports.openDatabase = () => {
  return new Promise(function(resolve, reject) {
    if (mongoose.connection.readyState === 1) {
      // Already connected - no more to be done
      resolve({success: true, obj: 'Connected!'})
    }
    logger.info('Opening database connection.')
    if (! process.env.MOTIVATOR_DEBUG) {
      loadEnv()
    }
    let debug = process.env.MOTIVATOR_DEBUG === 'true'
    let url = debug ? process.env.DEV_DB_URL : process.env.PROD_DB_URL
    mongoose.connect(url) .then(() => {
      mongoose.connection.on('error', err => {
        reject({success: false, obj: err})
      })

      resolve({success: true, obj: 'Connected!'})
    }).catch(err => {
      reject({success: false, obj: err})
    })
  })
}

const dropDatabase = module.exports.dropDatabase = () => {
  let debug = process.env.MOTIVATOR_DEBUG === 'true'
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
    // Handle default message case
    // Avoid saturating slack channel
    if (message.indexOf('Bob Smith') > -1) {
      resolve({success: true, obj: 'Message sent!'})
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
  // Create quote object and save to db
  let q = new Quote()
  q.text = data.text
  q.author = data.author
  return q.save().then(() => {
    return {success: true, obj: 'Quote save success!'}
  }).catch(err => {
    return {success: false, obj: err}
  })
}

const jobFunc = module.exports.jobFunc = () => {
  return getQuote().then(res => {
    if (! res.success) throw res
    // Construct quote string and send
    let message = res.obj.toQuoteString()
    return sendMessage(message)
  }).then(res => {
    if (! res.success) throw res
    // Message sent at this point
    return {success: true, obj: 'Message send success!'}
  }).catch(err => {
    return {success: false, obj: err}
  })
}
