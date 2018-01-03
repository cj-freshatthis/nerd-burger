const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  text:   String,
  author: String
})

module.exports = mongoose.model('Quote', schema)