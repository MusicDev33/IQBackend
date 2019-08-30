const mongoose = require('mongoose');

const SourceSchema = mongoose.Schema({
  name: {
    type: String
  },
  followers: {
    type: Number
  },
  questions: {
    type: Number
  },
  posterID: {
    type: String
  },
  views: {
    type: String
  },
  sourceURL: {
    type: String
  },
  tags: {
    type: Array
  },
  edition: {
    type: Number
  }
});

const Source = module.exports = mongoose.model('Source', SourceSchema);

module.exports.addTag = function(sourceURL, tagName, callback) {
  Source.findOne({sourceURL: sourceURL}, (err, source) => {
    if (err) throw err:
    if (source) {
      // FIX THIS
      if (source.tags.includes(tagName)) {
        source.tags.append(tagName);
        source.save((err, newSource) => {
          if (err) throw err;
          if (newSource) {
            callback(null, newSource);
          } else {
            callback(null, null);
          }
        })
      } else {
        callback(null, null)
      }
    } else {
      callback(null, null);
    }
  })
}

module.exports.saveSource = function(source, callback) {
  source.save((err, savedSource) => {
    if (err) throw err;
    if (savedSource) {
      callback(null, savedSource);
    } else {
      callback(null, null);
    }
  });
}

module.exports.deleteSource = function(sourceURL, callback) {
  Source.findOneAndDelete({sourceURL: sourceURL}, (err, deletedSource) => {
    if (err) throw err;
    if (deletedSource) {
      callback(null, deletedSource);
    } else {
      callback(null, null);
    }
  })
}

module.exports.sourceTextToURL = function(sourceText) {
  var urlText = ""
  var specialChars = "!@#$%^&*()>< '"

  for (var i = 0; i < sourceText.length; i++) {
    if (specialChars.indexOf(sourceText[i]) > -1) {
      urlText += "-"
    } else if (sourceText[i] == "?"){

    } else {
      urlText += sourceText[i]
    }
  }
  return urlText
}
