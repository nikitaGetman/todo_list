const express = require('express');
const hndbrs = require('express-handlebars');
const path = require('path');
// routers
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');

const app = express();

// Init handlebars
app.engine('.hbs', hndbrs({
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts'),
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Public Folder
app.use(express.static(path.join(__dirname, './public')));

// Init routers
app.use('/', indexRouter);
app.use('/user', userRouter);


app.listen(3000, () => {
  console.log('App listening on port 3000...');
});
