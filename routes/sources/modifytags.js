const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Source = require(modelPath + 'sourcemodel')

const StringUtils = require('../../ProtoChanges/string')

module.exports.addTagsToSource = function(req, res, next) {
  if (!req.params.tagname.match(/^[a-zA-Z0-9_\-]+$/g)) {
    return res.json({success: false, msg: 'Tags must be alphanumeric, but can also have dashes'})
  }

  const tagName = StringUtils.urlToName(req.params.tagname);
  Source.addTag(req.params.sourceid, tagName, (err, updatedSource) => {
    if (updatedSource) {
      return res.json({success: true, source: updatedSource});
    } else {
      return res.json({success: false, msg: 'Could\'t add tag :('});
    }
  })
}

module.exports.deleteTagFromSource = function(req, res, next) {
  const tagName = StringUtils.urlToName(req.params.tagname);
  Source.removeTag(req.params.sourceid, tagName, (err, updatedSource) => {
    if (updatedSource) {
      return res.json({success: true, source: updatedSource});
    } else {
      return res.json({success: false, msg: 'Couldn\'t remove tag.'});
    }
  })
}

module.exports.deleteAllTagsFromSource = function(req, res, next) {
  Source.deleteTags(req.params.sourceid, (err, updatedSource) => {
    if (updatedSource) {
      return res.json({success: true, source: updatedSource});
    } else {
      return res.json({success: false, msg: 'Couldn\'t remove tag.'});
    }
  })
}
