const utils = require('./utils'),
      prompt = require('prompt')

prompt.start()

const ask = () => {
  prompt.get(['text', 'author'], (err, res) => {
    if (err) throw err
    else {
      utils.addQuote(res).then(res => {
        if (! res.success) throw res
        else {
          prompt.get(['continue'], (err, res) => {
            if (err) throw err
            else if (res.continue === "y") ask()
            else utils.closeDatabase()
          })
        }
      }).catch(err => {
        utils.logger.error(err)
        utils.closeDatabase()
      })
    }
  })
}

utils.openDatabase().then(res => {
  if (! res.success) {
    utils.logger.error(res.obj)
  } else {
    ask()
  }
})

