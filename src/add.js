const utils = require('./utils'),
      prompt = require('prompt')

prompt.start()

prompt.get(['text', 'author'], (err, res) => {
  if (err) utils.logger.error(err)
  else utils.addQuote(res)
})