const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'You must have quote text!']
  },
  author: String
})

module.exports = mongoose.model('Quote', schema)