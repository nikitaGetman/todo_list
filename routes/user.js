const express = require('express');
const db = require('../db');


const router = express.Router();

// don`t use service lay because too small logic code

router.post('/login', (req, res) => {
  console.log(req.body);

  db.login(req.body.login, req.body.password, (e, r) => {
    console.log(e);
    if (e) {
      res.status(418).json('No such user');
    } else {
      console.log(r);
      let list = [];

      for (let i = 0; i < r.todoList.length; i += 1) {
        let item;
        db.getTodo(r.todoList[i], (_err, _res) => {
          item = _res;
          list.push(item);
          if (i === r.todoList.length - 1) {
            r.todoList = list;
            res.status(200).json(r);
            // res.json(r);
          }
        });
      }
    }
  });
});


router.post('/register', (req, res) => {
  console.log(req.body);

  if (req.body.password !== req.body.passwordConfirm) {
    console.log('Passwords do not match');
    res.send(418, 'Passwords do not match');
  } else {
    db.register(req.body.login, req.body.password, (e, r) => {
      if (e) {
        res.status(500).json('Not registered');
      } else {
        res.status(201).json(r);
      }
    });
  }
});

module.exports = router;
