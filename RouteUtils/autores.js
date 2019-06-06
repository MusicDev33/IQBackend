
// AutoResponse for callback with 2 items
// messages is an array with the following format:
// ["Message for an error", "Message for success", "Message for nil callback"]
module.exports.AutoResC2 = function(err, saveObject, messages){
  if (err){
    return {success: false, msg: messages[0]}
  }
  if (saveObject){
    return {success: true, msg: messages[1]}
  }else{
    return {success: false, msg: messages[0]}
  }
}
