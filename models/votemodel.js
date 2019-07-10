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

// Send callback as err, savedObject, oldObject...msg maybe?
// TODO: Clean this shit up, just wow.
// This is awful. Someone needs to fire me.
module.exports.addVote = function(userID, answerID, voteInt, callback){
  Vote.findOne({userid: userID, answerid: answerID}, (err, vote) => {
    if (err) throw err;
    if (vote){
      if (vote.vote === voteInt){
        callback(null, null, null)
      }else{
        Vote.findOneAndUpdate({userid: userID, answerid: answerID},
          {vote: voteInt}, (err, updatedVote) => {
            if (err) throw err;
            if (updatedVote){
              callback(null, vote, updatedVote)
            }else{
              callback(null, null, null)
            }
          })
      }
    }else{
      newVote = new Vote({
        userid: userID,
        answerid: answerID,
        vote: voteInt
      })
      newVote.save( (err, savedVote) => {
        if (err) throw err;
        if (savedVote){
          callback(null, savedVote)
        }else{
          callback(null, null)
        }
      })
    }
  })
}
