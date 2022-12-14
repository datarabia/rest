
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var dbService = require('./services/db');
const fileUpload = require('express-fileupload');
var pool = dbService.getPool();

var app = express();
app.use(session({
    secret: 'askfdkfieiiekPIOUIkel',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static('public'));
app.use(fileUpload());
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

var auth = require('./routes/auth');
var persons = require('./routes/persons');
var orgs = require('./routes/orgs');
var sectors = require('./routes/sectors');
var news = require('./routes/news');
var schools = require('./routes/schools');
var positions = require('./routes/positions');
var photos = require('./routes/photos');

app.use('/auth', auth(pool));
app.use('/persons', persons(pool));
app.use('/orgs', orgs(pool));
app.use('/sectors', sectors(pool));
app.use('/news', news(pool));
app.use('/schools', schools(pool));
app.use('/positions', positions(pool));
app.use('/photos', photos(pool));
var port = process.env.PORT || 3000;
app.listen(port);