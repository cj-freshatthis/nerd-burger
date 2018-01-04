const utils = require('./utils'),
      schedule = require("node-schedule")

// Load env vars
utils.loadEnv()

// Connect to database
utils.openDatabase().then((res) => {
  utils.closeDatabase()
}, (err) => {
  console.error(err)
})