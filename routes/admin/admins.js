const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

const AdminModule = require('./adminmodule');
const GodPowers = require('../../middleware/godpowers');

router.post('/token/gaia', [GodPowers.validateGodHeaders, AdminModule.gaiaLimit], AdminModule.generateGaiaToken);
router.post('/token/kronos', [GodPowers.validateGodHeaders, AdminModule.gaiaLimit], AdminModule.generateKronosToken);

router.get('/gaia/test', passport.authenticate('gaia', {session: false}), AdminModule.testGaiaRoute);
router.get('/kronos/test', passport.authenticate('kronos', {session: false}), AdminModule.testKronosRoute);

module.exports = router;
