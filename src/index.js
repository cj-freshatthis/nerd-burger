const utils = require('./utils'),
      schedule = require("node-schedule")

// Schedule job with given timing - 7 AM weekdays
let job = new schedule.Job('MainJob', () => {
  utils.openDatabase().then(res => {
    if (! res.success) throw res
    return utils.jobFunc()
  }).then(res => {
    if (! res.success) throw res
    utils.closeDatabase()
  }).catch(err => {
    utils.logger.error(err)
  })
})

job.schedule({
  hour: 2,
  minute: 35,
  dayOfWeek: [1, 2, 3, 4, 5]
  // second: null // testing only - fire every second
})

utils.logger.info('Scheduled job.')
utils.logger.info(job.name)
