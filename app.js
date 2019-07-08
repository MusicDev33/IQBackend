const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
const fs = require('fs');
const https = require('https')

var privateKey  = fs.readFileSync('/etc/letsencrypt/live/inquantir.com/privkey.pem', 'utf8');
var certificate = fs.readFileSync('/etc/letsencrypt/live/inquantir.com/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log("Database connected: " + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log("Database error: " + err)
})

mongoose.set('useFindAndModify', false);

const app = express();
const port = 2999;

// Allows other domains to use this domain as an API
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

// Routes
const users = require('./routes/users');
const questions = require('./routes/questions');
const subjects = require('./routes/subjects');
const sources = require('./routes/sources');

app.use('/v1/users', users);
app.use('/v1/questions', questions);
app.use('/v1/subjects', subjects);
app.use('/v1/sources', sources);

// create public folder with the index.html when finished
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.send("404 Error")
})

var httpsServer = https.createServer(credentials, app);

app.listen(2999, () => {
  console.log("Inquantir Backend started!")
})
