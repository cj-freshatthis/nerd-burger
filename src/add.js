const utils = require('./utils'),
      prompt = require('prompt')

prompt.start()

const ask = () => {

  prompt.get(['text', 'author'], (err, res) => {
    if (err) utils.logger.error(err)
    else utils.addQuote(res).then((res) => {
      prompt.get(['continue'], (err, res) => {
        if (err) utils.logger.error(err)
        else if (res.continue === "y") ask()
      })
    })
  })
}

ask()
