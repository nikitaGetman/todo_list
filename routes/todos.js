const express = require('express');
const db = require('../db');

const router = express.Router();

// don`t use service lay because too small logic code

// need user id
router.post('/add', (req, res) => {
  console.log(req.body);

  db.addTodo(req.body.userID, req.body.text, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});

// need user id and todo id
router.post('/toggle', (req, res) => {
  console.log(req.body);

  db.toggleTodo(req.body.userID, req.body.todoID, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});

// need user id and todo id
router.post('/delete', (req, res) => {
  console.log(req.body);

  db.deleteTodo(req.body.userID, req.body.todoID, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
});

module.exports = router;
