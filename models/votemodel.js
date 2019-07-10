const mongoose = require('mongoose');

const VoteSchema = mongoose.Schema({
  vote: {
    type: Number
  },
  userid: {
    type: String
  },
  answerid: {
    type: String
  }
});

const Vote = module.exports = mongoose.model('Vote', VoteSchema);

// Send callback as err, savedObject, oldObject?
module.exports.addVote = function(userID, answerID, voteInt, callback){
  Vote.findOne({userid: userID, answerid: answerID}, (err, vote) => {
    if (err) throw err;
    if (vote){
      if (vote.vote === voteInt){
        callback(null, null)
      }else{

      }
    }
  })
}
