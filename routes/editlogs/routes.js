const express = require('express')
const router = express.Router()

const EditLogModule = require('./editlogsmodule');

router.get('/', EditLogModule.getEditLogs);
router.get('/paid', EditLogModule.getPaidEditLogs);
router.get('/paid/:userhandle', EditLogModule.getPaidEditLogsFromUser);
router.get('/users', EditLogModule.getCMAgents);

module.exports = router;
