const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')
const Location = require(modelPath + 'locationmodel')

module.exports.addLocation = function (req, res, next) {
  const newLocation = new Location({
    city: req.body.city,
    continent_code: req.body.continent_code,
    continent_name: req.body.continent_name,
    country_code: req.body.country_code,
    country_name: req.body.country_name,
    ip: req.body.ip,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    region_code: req.body.region_code,
    region_name: req.body.region,
    zip: req.body.zip
  })
  Location.addLocation(newLocation, (err, location) => {
    if (err) throw err;
    if (location){
      return res.json({success: true, msg: "Anonymous location data sent."})
    } else {
      return res.json({success: false, msg: "Couldn't collect anonymous location data."})
    }
  })
}
