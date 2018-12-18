const mongoose = require('mongoose');

const todoScheme = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,
  author: mongoose.Schema.Types.ObjectId,
  text: String,
  visible: Boolean,

});

module.exports = mongoose.model('Todo', todoScheme);
