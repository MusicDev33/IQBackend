const express = require('express')
const router = express.Router()

const JobApplicationModule = require('./jobsmodule');

router.post('/apply', JobApplicationModule.sendApplication);

module.exports = router;
