const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  success:  Boolean,
  obj:      mongoose.Schema.Types.Mixed,
  message:  String
})

module.exports = mongoose.model('Result', schema)