const utils = require('./utils'),
      schedule = require("node-schedule"),
      Quote = require('./models/quote')

// Load env vars
utils.loadEnv()

const getQuote = () => {
  // Connect to database
  utils.openDatabase().then((res) => {
    // Get a random quote

    utils.closeDatabase()
  }, (err) => {
    console.error(err)
  })
}

