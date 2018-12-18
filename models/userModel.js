const mongoose = require('mongoose');

const userScheme = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  todoList: Array,

});

module.exports = mongoose.model('User', userScheme);
