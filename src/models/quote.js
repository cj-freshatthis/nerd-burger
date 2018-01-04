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
schema.plugin(random, { path: 'r' });

module.exports = mongoose.model('Quote', schema)