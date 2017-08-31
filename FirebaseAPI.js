const firebase = require('firebase') 

var exports = module.exports = {};

function updateUser(uid, key, value){
  firebase.database().ref().child('users').child(uid)
    .update({[key]:value})
}

exports.getUser = function(key) {
  return firebase.database().ref().child('users').child(key).once('value')
    .then((snap) => snap.val())
}

function getUserCb(key, func) {
  firebase.database().ref().child('users').child(key).once('value')
    .then((snap) => func(snap.val()))
}

function getUsersCb (keyArray, func){
  firebase.database().ref().child('users').once('value')
    .then((snap) => {
      if(snap.val() != null) {
        const users = []

        keyArray.forEach((key) => {
          users.push(snap.val()[key])
        })

        func(users)
      }
    })
}

function getChat (key){
  return firebase.database().ref().child('messages').child(key).once('value')
    .then((snap) => snap.val())
}

function getChatCb (key, func){
  return firebase.database().ref().child('messages').child(key).once('value')
    .then((snap) => { func(snap.val()) })
}

function getChatsCb (keyArray, func){
  firebase.database().ref().child('messages').once('value')
    .then((snap) => {
      if(snap.val() != null) {
        const chats = []

        keyArray.forEach((key) => {
          chats.push(snap.val()[key])
        })

        func(chats)
      }
    })
}

function getChatMessageCountFromUid (chatID, uid){
  firebase.database().ref().child('messages').child(key).once('value')
    .then((snap) => {
      const messageCount = Object.values(snap.val()).filter((message) => {
        return message.sender == uid
      }).length

      return messageCount
    })
}

function getChatWithProfiles (userKey, profileKey, func) {
  //Sort uid concatenation in order of greatness so every user links to the same chat
  const uidArray = [userKey, profileKey]
  uidArray.sort()
  const chatID = uidArray[0]+'-'+uidArray[1]

  getChatCb(chatID, (chat) => { func(chat) })
}

function getChatIDsWithProfilesAndUser (userKey, profileKeyArray, func) {
  const chatIDs = []

  profileKeyArray.forEach((profileKey) => {
    const uidArray = [userKey, profileKey]
    uidArray.sort()
    const chatID = uidArray[0]+'-'+uidArray[1]

    chatIDs.push(chatID)
  })

  func(chatIDs)
}


function getProfilesInChatsWithKey (key, func) {
  return firebase.database().ref().child('messages').once('value')
    .then((snap) => {
    if(snap.val() != null) {
        const profileUids = []

        Object.keys(snap.val()).forEach((chatID) => {
          if(chatID.split('-').some((uid) => {return uid == key}))
            profileUids.push(chatID.split('-').filter((uid) => {return uid != key}))
        })

        getUsersCb(profileUids, (profiles) => {func(profiles)})
      }
    })
}

function checkForChat (userKey, profileKey, func) {
  firebase.database().ref().child('messages').once('value')
    .then((snap) => {
      if(snap.val() != null) {
        let hasChat = false

        Object.keys(snap.val()).forEach((chatID) => {
          if(chatID.split('-').some((uid) => {return uid == userKey}) && chatID.split('-').some((uid) => {return uid == profileKey}))
            hasChat = true
        })

        func(hasChat)
      } 
  })
}

function watchForNewChat (userKey, profileKey, func) {
  firebase.database().ref().child('messages').on('value', (snap) => {
      if(snap.val() != null) {
        let hasChat = false

        Object.keys(snap.val()).forEach((chatID) => {
          if(chatID.split('-').some((uid) => {return uid == userKey}) && chatID.split('-').some((uid) => {return uid == profileKey})){
            hasChat = true
          }
        })

        func(hasChat)
      } 
  })
}

function watchChat (key, func) {
  firebase.database().ref().child('messages').child(key).on('value', (snap) => {
      if(snap.val() != null) {
        func(snap.val())
      } 
  })
}

function removeWatchForChat () {
  firebase.database().ref().child('messages').off()
}

function watchChatForRecentMessage (key, func) {
  firebase.database().ref().child('message').child(key).on('value', (snap) => {
      if(snap.val() != null) {
        console.log('snapaf slkdjfalskdfjlkasjf')
        console.log(snap.val()[0])
        func(snap.val()[0])
      } 
  })
}


function watchChatsWithProfilesInKey (key, func) {
  return firebase.database().ref().child('messages').on('value', (snap) => {
    if(snap.val() != null) {
        const profileUids = []

        Object.keys(snap.val()).forEach((chatID) => {
          if(chatID.split('-').some((uid) => {return uid == key}))
            profileUids.push(chatID.split('-').filter((uid) => {return uid != key}))
        })

        getUsersCb(profileUids, (profiles) => {func(profiles)})
      }
    })
}

function turnOffChatListener () {
  return firebase.database().ref().child('messages').off()
}


function getAllUsers (func) {
  firebase.database().ref().child('users').once('value')
    .then((snap) => {
      if(snap.val() != null) {
        if(snap.val() != null)
          getUsersCb(Object.keys(snap.val()), (profiles) => {
            if(profiles != null)
              func(profiles)
          })
        else
          func(null)
      }
    })
}

function watchUser (key, func) {
  firebase.database().ref().child('users/'+key).on('value', (snap) => {
    func(snap.val())
  })
}

function removeWatchUser (key) {
  firebase.database().ref().child('users/'+key).off()
}