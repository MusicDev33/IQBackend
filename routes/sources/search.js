const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Source = require(modelPath + 'sourcemodel')

module.exports.searchSources = function(req, res, next) {
  Source.searchByName(req.params.searchterms.substring(0, 39), (err, sources) => {
    if (sources.length) {
      return res.json({success: true, sources: sources});
    } else {
      return res.json({success: false, msg: 'Couldn\'t find any sources based on your search terms...', sources: []})
    }
  })
}
