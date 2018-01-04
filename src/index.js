const utils = require('./utils'),
      schedule = require("node-schedule")

// Schedule job with given timing - 7 AM weekdays
let job = new schedule.Job('MainJob', () => {
  utils.openDatabase().then(res => {
    if (! res.success) throw res
    return utils.jobFunc()
  }).then(res => {
    if (! res.success) throw res
    utils.logger.info(res)
    utils.closeDatabase()
  }).catch(err => {
    utils.logger.error(err)
    utils.closeDatabase()
  })
})

// 7 AM weekdays
job.schedule({
  hour: 7,
  minute: 0,
  dayOfWeek: [1, 2, 3, 4, 5]
  //second: null // testing only - fire every second
})

utils.logger.info('Scheduled job.')
