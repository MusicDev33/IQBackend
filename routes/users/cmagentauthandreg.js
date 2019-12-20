// Auth and registration for Content Management Agents

const modPath = require('../modelpath')
const modelPath = modPath.MODEL_PATH;
const User = require(modelPath + 'usermodel')

module.exports.registerCMagent = function(req, res, next) {
  // Ugh, nested ifs AND callbacks. Can you think of anything worse?
  // P.S. Maybe I just suck at writing decent code...

  if (req.body.handle.indexOf(' ') >= 0 || !req.body.handle.match(/^[a-z0-9_]+$/g)){
    return res.json({success: false, msg: "You can't have special characters in your handle. Letters must be lowercase."})
  }

  if (!req.body.firstName.match(/^[a-zA-Z0-9_\-']+$/g) || !req.body.lastName.match(/^[a-zA-Z0-9_\-']+$/g)) {
    return res.json({success: false, msg: "You can't have special characters in your name."})
  }

  if (req.body.phoneNumber && !req.body.phoneNumber.match(/^[0-9\-]+$/g)) {
    return res.json({success: false, msg: "You can only have numbers in your phone number."})
  }

  if (req.body.password.length < 8) {
    return res.json({success: false, msg: 'Your password must have 8 characters in it!'})
  }

  User.getUserByHandle(req.body.handle, (err, user) => {
    if (err) throw err;
    if (user){
      return res.json({success: false, msg: "There's already a user by that name!"});
    } else {
      User.getUserByEmail(req.body.email, (err, user) => {
        if (err) throw err;
        if (user){
          return res.json({success: false, msg: "This email is already associated with an account."})
        } else {
          let newCMagent = new User({
            fbTokens: [],
            name: req.body.firstName + " " + req.body.lastName,
            email: req.body.email.toLowerCase(),
            handle: req.body.handle,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            bio: "",
            profileImage: "",
            customization: {},
            currentSubjects: [],
            currentSources: [],
            profileHits: 0,
            knowledge: {},
            googleID: '',
            paidProgram: true
          });

          User.addContentManagementAgent(newCMagent, (err, user) => {
            if (err) throw err;
            if (user) {
              return res.json({success: true, msg: 'Content Management Agent registered!'})
            } else {
              return res.json({success: false, msg: 'Something went wrong!'})
            }
          });
        }
      });
    }
  });
}
