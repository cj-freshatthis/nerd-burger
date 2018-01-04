const utils = require('./utils'),
      schedule = require('node-schedule')

const testing = () => {
  /// Run `npm start test` to test the job once
  return process.argv[2] === 'test'
}

// Schedule job with given timing - 7 AM weekdays
const job = new schedule.Job('MainJob', () => {
  utils.openDatabase().then(res => {
    if (! res.success) throw res
    return utils.jobFunc()
  }).then(res => {
    if (! res.success) throw res
    console.info(res)
    utils.closeDatabase()
    if (testing()) job.cancel()
  }).catch(err => {
    console.error(err)
    utils.closeDatabase()
    if (testing()) job.cancel()
  })
})

const timing = testing() ? {
    second: null
  }: {
    hour: 7,
    minute: 0,
    dayOfWeek: [1, 2, 3, 4, 5]
}

job.schedule(timing)

console.info('Scheduled job.')
console.info(job.nextInvocation())
