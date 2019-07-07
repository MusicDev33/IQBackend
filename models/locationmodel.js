const mongoose = require('mongoose');

const LocationSchema = mongoose.Schema({
  city: {
    type: String
  },
  continent_code: {
    type: String
  },
  continent_name: {
    type: String
  },
  country_code: {
    type: String
  },
  country_name: {
    type: String
  },
  ip: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  region_code: {
    type: String
  },
  region_name: {
    type: String
  },
  zip: {
    type: String
  }
});

const Location = module.exports = mongoose.model('Location', LocationSchema);

module.exports.addLocation = function(location, callback){
  // This is all just anonymous data that tells me where interest for the site
  // is coming from.
  Location.findOne({ip: location.ip}, (err, foundLocation) => {
    if (err) throw err;
    if (foundLocation){
      callback(null, null)
    }else{
      location.save(callback)
    }
  })
}
