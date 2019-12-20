const express = require('express')
const router = express.Router()

const EditLogModule = require('./editlogsmodule');

router.get('/', EditLogModule.getEditLogs);
router.get('/paid', EditLogModule.getPaidEditLogs);

module.exports = router;
