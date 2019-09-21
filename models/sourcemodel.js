const mongoose = require('mongoose');
const StringUtils = require('../ProtoChanges/string');

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

module.exports.searchByName = function(sourceString, callback) {
  const regexp = '^' + StringUtils.sanitize(sourceString);
  Source.find({ sourceURL: {$regex : regexp, $options: 'i'}}, (err, sources) => {
    if (err) throw err;
    // Will return an array, regardless of whether or not it's empty
    if (sources) {
      callback(null, sources);
    } else {
      callback(null, null);
    }
  });
}

module.exports.findByName = function(source, callback){
  Source.findOne({name: source}, (err, foundSource) => {
    if (err) throw err;
    if (foundSource){
      console.log('found!')
      callback(null, foundSource)
    }else{
      callback(null, null)
    }
  })
}

module.exports.addTag = function(sourceID, tagName, callback) {
  const id = mongoose.Types.ObjectId(sourceID);
  Source.findById(id, (err, source) => {
    if (err) throw err;
    if (source) {
      if (!source.tags.includes(tagName)) {
        source.tags.push(tagName);
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

// Keep an eye on performance.
module.exports.removeTag = function(sourceID, tagName, callback) {
  const id = mongoose.Types.ObjectId(sourceID);
  Source.findById(id, (err, source) => {
    if (err) throw err;
    if (source) {
      source.tags = source.tags.filter(tag => tag !== tagName);
      source.save((err, newSource) => {
        if (err) throw err;
        if (newSource) {
          callback(null, newSource);
        } else {
          callback(null, null);
        }
      })
    } else {
      callback(null, null);
    }
  })
}

module.exports.deleteTags = function(sourceID, callback) {
  const id = mongoose.Types.ObjectId(sourceID);
  Source.findById(id, (err, source) => {
    if (err) throw err;
    if (source) {
      source.tags = [];
      source.save((err, newSource) => {
        if (err) throw err;
        if (newSource) {
          callback(null, newSource);
        } else {
          callback(null, null);
        }
      })
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

module.exports.deleteSource = function(sourceID, callback) {
  const id = mongoose.Types.ObjectId(sourceID);
  Source.findByIdAndRemove(id, (err, deletedSource) => {
    if (err) throw err;
    if (deletedSource) {
      callback(null, deletedSource);
    } else {
      callback(null, null);
    }
  })
}

module.exports.addFollower = function(source, newCount, callback){ // poorly named...I know...
  Source.findOneAndUpdate({name: source},
    {followers: newCount},
    {new: true}, (err, updatedSource) => {
      if (err) throw err;
      if (updatedSource){
        callback(null, updatedSource);
      }else{
        callback(null, null)
      }
  })
}

module.exports.removeFollower = function(sourceName, callback){
  Source.findOne({name: sourceName}, (err, source) => {
    if (err) throw err;
    if (source){
      Source.findOneAndUpdate({name: source.name},
        {followers: source.followers - 1},
        {new: true}, (err, updatedSource) => {
          if (err) throw err;
          if (updatedSource){
            callback(null, updatedSource);
          } else {
            console.log(1)
            callback(null, null)
          }
      })
    } else {
      console.log(2)
      callback(null, null)
    }
  })
}

module.exports.sourceTextToURL = function(sourceText) {
  let urlText = ""
  const specialChars = "!@#$%^&*()>< '"

  for (let i = 0; i < sourceText.length; i++) {
    if (specialChars.indexOf(sourceText[i]) > -1) {
      urlText += "-"
    } else if (sourceText[i] == "?"){

    } else {
      urlText += sourceText[i]
    }
  }
  return urlText
}
