const mongoose = require('mongoose');

const User = require('./models/userModel');
const Todo = require('./models/todoModel');


class DB {
  // connect to MongoDB
  static connect(cb) {
    console.log('DB conecting...');

    mongoose.connect('mongodb://localhost/todo', {
      useNewUrlParser: true,
    })
      .then(() => {
        console.log('MongoDB has started ...');
        cb(null);
      })
      .catch((e) => {
        console.log(e);
        cb(e);
      });
  }

  // create user and return id
  static register(username, password, cb) {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password,
      todoList: [],
    });

    newUser.save()
      .then((res) => {
        cb(null, res);
      })
      .catch((err) => {
        cb(err, null);
      });
  }

  // return userID and todoList if user exist
  static login(name, pass, cb) {
    User.findOne({ username: name, password: pass })
      .exec()
      .then((res) => {
        if (res === null) {
          console.log('User not found');
          cb('User not found', null);
        } else {
          console.log('User found');
          cb(null, res);
        }
      })
      .catch((err) => {
        console.log('Internal error');
        cb(err, null);
      });
  }

  static addTodo(userID, todoText, cb) {
    const newTodo = new Todo({
      _id: new mongoose.Types.ObjectId(),
      text: todoText,
      author: new mongoose.Types.ObjectId(userID),
      visible: true,
    });

    newTodo.save()
      .then((r) => {
        const id = r._id;

        User.findById(new mongoose.Types.ObjectId(userID))
          .exec()
          .then((res) => {
            if (res === null) {
              // console.log('User not found');
              cb('User not found', null);
            } else {
              let todos = res.todoList;
              todos.push(id);

              User.findByIdAndUpdate(new mongoose.Types.ObjectId(userID), { todoList: todos })
                .exec()
                .then((_res) => {
                  cb(null, r);
                })
                .catch((_err) => {
                  // console.log(_err);
                  cb(_err, null);
                });
            }
          })
          .catch((err) => {
            // console.log('Internal error');
            cb(err, null);
          });
      })
      .catch((e) => {
        cb(e, null);
      });
  }

  static toggleTodo(userID, todoID, cb) {
    Todo.findOne({
      _id: new mongoose.Types.ObjectId(todoID),
      author: new mongoose.Types.ObjectId(userID),
    })
      .exec()
      .then((r) => {
        console.log(r);
        Todo.findByIdAndUpdate(new mongoose.Types.ObjectId(todoID), { visible: !r.visible })
          .exec()
          .then((res) => {
            cb(null, res);
          })
          .catch((err) => {
            cb(err, null);
          });
      })
      .catch((e) => {
        cb(e, null);
      });
  }

  static deleteTodo(userID, todoID, cb) {
    Todo.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(todoID),
      author: new mongoose.Types.ObjectId(userID),
    })
      .exec()
      .then((res) => {
        // cb(null, res);
      })
      .catch((err) => {
        cb(err, null);
      });


    User.findById(new mongoose.Types.ObjectId(userID))
      .exec()
      .then((res) => {
        if (res === null) {
          cb('User not found', null);
        } else {
          const todos = res.todoList;
          const id = new mongoose.Types.ObjectId(todoID);
          const filteredTodos = todos.filter(todo => String(todo) !== todoID);


          User.findByIdAndUpdate(new mongoose.Types.ObjectId(userID), { todoList: filteredTodos })
            .exec()
            .then((r) => {
              cb(null, r);
            })
            .catch((e) => {
              cb(e, null);
            });
        }
      })
      .catch((err) => {
        cb(err, null);
      });
  }

  static getTodo(todoID, cb) {
    Todo.findOne({
      _id: new mongoose.Types.ObjectId(todoID),
    })
      .exec()
      .then((r) => {
        // console.log(r);
        cb(null, r);
      })
      .catch((e) => {
        cb(e, null);
      });
  }
}

module.exports = DB;
