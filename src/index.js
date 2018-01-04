const utils = require('./utils'),
      schedule = require("node-schedule")

// Load env vars
utils.loadEnv()

const jobFunc = () => {
  utils.openDatabase().then((res) => {
    if (! res.success) throw res.obj
    return utils.getQuote()
  }).then((res) => {
    if (! res.success) throw res.obj
    // Construct quote string and send
    let message = res.obj.toQuoteString()
    return utils.sendMessage(message)
  }).then((res) => {
    if (! res.success) throw res.obj
    // Message sent at this point
    utils.logger.info('Message send success!')
    utils.closeDatabase()
  }).catch((err) => {
    utils.logger.error(err)
    utils.closeDatabase()
  })
}

jobFunc()

