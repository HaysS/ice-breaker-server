const firebase = require('firebase') 

var exports = module.exports = {};

exports.getUser = function(key) {
  return firebase.database().ref().child('users').child(key).once('value')
    .then((snap) => snap.val())
}

exports.getUserCb = function(key, func) {
  firebase.database().ref().child('users').child(key).once('value')
    .then((snap) => func(snap.val()))
}

exports.setPaid = function(userKey, profileKey) {
  const now = new Date();

  firebase.database().ref().child('users').child(userKey).child("paidProfiles").update({[profileKey]:{date: now}})
}