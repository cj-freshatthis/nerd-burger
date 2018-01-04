const utils = require('./utils'),
      schedule = require("node-schedule")

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

// Schedule job with given timing - 7 AM weekdays
schedule.scheduleJob({
  hour: 7,
  minute: 0,
  dayOfWeek: [1, 2, 3, 4, 5]
}, jobFunc)

utils.logger.info('Scheduled job.')

