const express = require('express')
const router = express.Router()

const SearchModule = require('./searchmodule')

router.get('/everything/:searchterm', SearchModule.globalSearch);

module.exports = router;
