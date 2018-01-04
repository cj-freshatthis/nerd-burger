const mongoose = require('mongoose'),
      dotenv = require('dotenv'),
      { IncomingWebhook } = require('@slack/client')
      Quote = require('./models/quote'),
      Result = require('./models/result')

const isDebug = module.exports.isDebug = () => {
  return process.env.MOTIVATOR_DEBUG === 'true'
}

const loadEnv = module.exports.loadEnv = () => {
  console.info('Loading environment variables.')
  dotenv.load()
  console.info('MOTIVATOR_DEBUG = ' + process.env.MOTIVATOR_DEBUG)
}

const closeDatabase = module.exports.closeDatabase = () => {
  console.info('Closing database connection.')
  mongoose.disconnect()
}

const openDatabase = module.exports.openDatabase = () => {
  return new Promise(function(resolve, reject) {
    if (mongoose.connection.readyState === 1) {
      // Already connected - no more to be done
      resolve({success: true, obj: 'Connected!'})
    }
    console.info('Opening database connection.')
    if (! process.env.MOTIVATOR_DEBUG) {
      loadEnv()
    }
    let url = isDebug() ? process.env.DEV_DB_URL : process.env.PROD_DB_URL
    mongoose.connect(url) .then(() => {
      mongoose.connection.on('error', err => {
        reject(new Result({
          success: false,
          obj: err,
          message: 'Error connecting to mongo instance.'
        }))
      })

      resolve(new Result({
        success: true,
        obj: mongoose.connection,
        message: 'Connected to mongo instance successfully!'
      }))
    }).catch(err => {
      reject(new Result({
        success: false,
        obj: err,
        message: 'Error connecting to mongo instance.'
      }))
    })
  })
}

const sendMessage = module.exports.sendMessage = (message, hook) => {
  return new Promise((resolve, reject) => {
    if (! hook) {
      if (! process.env.SLACK_URL) loadEnv()
      hook = process.env.SLACK_URL
    }
    // Handle default message case
    // Avoid saturating slack channel with test messages
    if (message.indexOf('Bob Smith') > -1) {
      resolve(new Result({
        success: true,
        obj: {
          message: message
        },
        message: 'Message sent!'
      }))
    } else {
      let notification = new IncomingWebhook(hook)
      notification.send(message, (err, res) => {
        if (err) {
          reject(new Result({
            success: false,
            obj: err,
            message: 'Error sending message to slack.'
          }))
        }
        else {
          resolve(new Result({
            success: true,
            obj: res,
            message: 'Sent message to slack!'
          }))
        }
      })
    }
  })
}

const getQuote = module.exports.getQuote = () => {
  return new Promise((resolve, reject) => {
    Quote.findRandom().limit(1).exec((err, docs) => {
      if (err) {
        reject(new Result({
          success: false,
          obj: err,
          message: 'Error querying random document.'
        }))
      }
      else {
        resolve(new Result({
          success: true,
          obj: docs[0],
          message: 'Got the random quote.'
        }))
      }
    })
  })
}

const addQuote = module.exports.addQuote = (data) => {
  // Create quote object and save to db
  let q = new Quote()
  q.text = data.text
  q.author = data.author
  return q.save().then(() => {
    return new Result({
      success: true,
      obj: err,
      message: 'Added quote!'
    })
  }).catch(err => {
    return new Result({
      success: false,
      obj: err,
      message: 'Error saving new quote.'
    })
  })
}

const jobFunc = module.exports.jobFunc = () => {
  return getQuote().then(res => {
    if (! res.success) throw res
    // Construct quote string and send
    return sendMessage(res.obj.toQuoteString())
  }).then(res => {
    if (! res.success) throw res
    // Message sent at this point
    return new Result({
      success: true,
      obj: res,
      message: 'Completed job!'
    })
  }).catch(err => {
    return new Result({
      success: false,
      obj: err,
      message: 'Error processing job function.'
    })
  })
}
