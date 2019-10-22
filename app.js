const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
const fs = require('fs');
const https = require('https');
const helmet = require('helmet');
require('dotenv').config();

let apiBase = '/api/v1/';

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'DEVTEST') {
  var privateKey  = fs.readFileSync('/etc/letsencrypt/live/inquantir.com/privkey.pem', 'utf8');
  var certificate = fs.readFileSync('/etc/letsencrypt/live/inquantir.com/cert.pem', 'utf8');

  var credentials = {key: privateKey, cert: certificate};

  apiBase = '/v1/';
}

mongoose.connect(config.database);

mongoose.connection.on('connected', () => {
  console.log('Database connected: ' + config.database);
});

mongoose.connection.on('error', (err) => {
  console.log('Database error: ' + err)
})

mongoose.set('useFindAndModify', false);

// Rest of the app
const app = express();
let port = 2999;
if (process.env.NODE_ENV === 'DEVTEST') {
  port = 3000;
}

app.use(helmet());
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Allows other domains to use this domain as an API
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json())

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)
require('./config/adminpass').chaos(passport)
require('./config/adminpass').gaia(passport)
require('./config/adminpass').kronos(passport)

const acceptedAgents = ['IQAPIv1', 'IQiOSv1', 'IQAndroidv1']

// Check IQ-User-Agent
const checkAgent = function(req, res, next) {
  if (!acceptedAgents.includes(req.header('IQ-User-Agent'))) {
    res.sendStatus(404)
  } else {
    next()
  }
}

app.use(checkAgent);

// Routes
const users = require('./routes/users/routes');
const questions = require('./routes/questions/routes');
const subjects = require('./routes/subjects/routes');
const sources = require('./routes/sources/routes');
const feed = require('./routes/feed/routes');
const search = require('./routes/search/routes');
const admin = require('./routes/admin/routes');

app.use(apiBase + 'users', users);
app.use(apiBase + 'questions', questions);
app.use(apiBase + 'subjects', subjects);
app.use(apiBase + 'sources', sources);
app.use(apiBase + 'feed', feed);
app.use(apiBase + 'search', search);

app.use(apiBase + 'iqad/min', admin);

// create public folder with the index.html when finished
app.use(express.static(path.join(__dirname, 'public')))

app.get(apiBase + '/', (req, res) => {
  res.status(404).send('404 Error')
})

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'DEVTEST') {
  var httpsServer = https.createServer(credentials, app)
}

app.listen(port, () => {
  console.log('Inquantir Backend started!');
})
