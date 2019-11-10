import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import https from 'https';
import mongoose from 'mongoose';
import passport from 'passport';
import path from 'path';

import { chaosPassport, gaiaPassport, kronosPassport } from './config/adminpass';
import { dbConfig } from './config/database';

import passportMain from './config/passport';

import { Request, RequestHandler, Response } from 'express';

dotenv.config();

let apiBase = '/api/v1/';

let credentials: any;

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'DEVTEST') {
  const privateKey  = fs.readFileSync('/etc/letsencrypt/live/inquantir.com/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/inquantir.com/cert.pem', 'utf8');

  credentials = {key: privateKey, cert: certificate};

  apiBase = '/v1/';
}

mongoose.connect(dbConfig.database);

mongoose.connection.on('connected', () => {
  console.log('Database connected: ' + dbConfig.database);
});

mongoose.connection.on('error', (err: any) => {
  console.log('Database error: ' + err);
});

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

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

passportMain(passport);
chaosPassport(passport);
kronosPassport(passport);
gaiaPassport(passport);

const acceptedAgents = ['IQAPIv1', 'IQiOSv1', 'IQAndroidv1'];

// Check IQ-User-Agent
const checkAgent = (req: Request, res: Response, next: any) => {
  if (!acceptedAgents.includes(req.header('IQ-User-Agent'))) {
    res.sendStatus(404);
  } else {
    next();
  }
};

app.use(checkAgent);

// Routes
import userRoutes from './routes/users/routes';
// const questions = require('../routes/questions/routes');
// const subjects = require('../routes/subjects/routes');
// const sources = require('../routes/sources/routes');
// const feed = require('../routes/feed/routes');
// const search = require('../routes/search/routes');
// const admin = require('../routes/admin/routes');
// const feedback = require('../routes/feedback/routes');

app.use(apiBase + 'users', userRoutes);
// app.use(apiBase + 'questions', questions);
// app.use(apiBase + 'subjects', subjects);
// app.use(apiBase + 'sources', sources);
// app.use(apiBase + 'feed', feed);
// app.use(apiBase + 'search', search);
// app.use(apiBase + 'feedback', feedback);
//
// app.use(apiBase + 'iqad/min', admin);

// create public folder with the index.html when finished
app.use(express.static(path.join(__dirname, 'public')));

app.get(apiBase + '/', (req, res) => {
  res.status(404).send('404 Error');
});

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'DEVTEST') {
  const httpsServer = https.createServer(credentials, app);
}

app.listen(port, () => {
  console.log('Inquantir Backend (TypeScript) started in mode \'' + process.env.NODE_ENV + '\'');
  console.log('Port: ' + port);
});
