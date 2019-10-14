const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const AdminModule = require('./adminmodule');
const GodPowers = require('../../middleware/godpowers');

router.post('/token/gaia', [GodPowers.validateGodHeaders, AdminModule.gaiaLimit], AdminModule.generateGaiaToken);

module.exports = router;
