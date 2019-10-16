const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Source = require(modelPath + 'sourcemodel')

module.exports.deleteSource = function(req, res, next) {
  Source.deleteSource(req.params.sourceid, (err, deletedSource) => {
    if (deletedSource) {
      return res.json({success: true, msg: 'Source deleted successfully!'})
    } else {
      return res.json({success: false, msg: 'Source couldn\'t be deleted...'})
    }
  });
}
