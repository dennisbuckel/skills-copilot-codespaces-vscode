// create web server
// npm install express
const express = require('express');
const app = express();
const port = 3000;

// npm install body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// npm install mysql
const mysql = require('mysql');
const conn = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'comment'
};

// npm install ejs
app.set('views', './views');
app.set('view engine', 'ejs');

// npm install moment
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// npm install express-session
const session = require('express-session');
app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: true
}));

// npm install multer
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({storage: storage});

// npm install fs
const fs = require('fs');

app.get('/', (req, res) => {
  res.redirect('/list');
});

app.get('/list', (req, res) => {
  const sql = 'SELECT * FROM comment ORDER BY id DESC';
  const query = conn.query(sql, (err, rows) => {
    if (err) throw err;
    res.render('list', {rows: rows, moment: moment});
  });
});

app.get('/write', (req, res) => {
  res.render('write');
});

app.post('/save', upload.single('image'), (req, res) => {
  const sql = 'INSERT INTO comment SET ?';
  const comment = {
    name: req.body.name,
    content: req.body.content,
    image: (req.file) ? req.file.filename : ''
  };
  const query = conn.query(sql, comment, (err, rows) => {
    if (err) throw err;
    res.redirect('/list');
  });
});

app.get('/delete/:id', (req, res) => {
  const sql = 'SELECT * FROM comment WHERE id = ?';
  });
