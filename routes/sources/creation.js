const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const Source = require(modelPath + 'sourcemodel')

module.exports.createSource = function(req, res, next){
  const body = req.body;

  if (!body.name.match(/^[a-zA-Z0-9\-' ]+$/g)) {
    return res.json({success: false, msg: 'Source names are alphanumeric (and may contain dashes and apostrophes)'})
  }

  // Should I set a posterID for these or no?
  const newSource = new Source({
    name: body.name,
    followers: 0,
    posterID: 'no id',
    views: 0,
    sourceURL: Source.sourceTextToURL(body.name), // Use a function to create this
    tags: body.tags ? body.tags : [],
    edition: body.edition ? body.edition : '',
    author: body.author ? body.author : ''
  })

  Source.saveSource(newSource, (err, savedSource) => {
    if (savedSource) {
      return res.json({success: true, msg: 'Successfully saved source!', source: savedSource});
    } else {
      return res.json({success: false, msg: 'Couldn\'t save source.'})
    }
  });
}
