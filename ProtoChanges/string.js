// ProtoChanges
// Meant to be for prototypal changes that don't actually change the prototype.


module.exports.titleCase = function(str) {
  return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
}

module.exports.nameToURL = function(name) {
  let urlText = ''
  const specialChars = '!@#$%^&*()>< \'';

  for (var i = 0; i < name.length; i++) {
    if (specialChars.indexOf(name[i]) > -1){
      urlText += '-';
    } else if (name[i] === '?') {

    } else {
      urlText += name[i]
    }
  }
  return urlText
}

// Dashes will be turned into spaces
module.exports.urlToName = function(url) {
  let nameText = '';
  const specialChars = '!@#$%^&*()>< \'';

  for (let i = 0; i < url.length; i++) {
    if (url[i] === '-') {
      nameText += ' ';
    } else if (specialChars.indexOf(url[i]) > -1) {
      nameText += ''; // Basically do nothing.
    } else {
      nameText += url[i];
    }
  }
  return nameText;
}
