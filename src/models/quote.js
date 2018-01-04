const mongoose = require('mongoose'),
      random = require('mongoose-random')

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'You must have quote text!']
  },
  author: String
})

// Adding random plugin
schema.plugin(random, { path: 'r' })

// Adding method to convert to string
schema.methods.toQuoteString = function() {
  return '"' + this.text + '" - ' + this.author
}

module.exports = mongoose.model('Quote', schema)