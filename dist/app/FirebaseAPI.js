function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}var firebase=require('firebase');

var _exports=module.exports={};

function updateUser(uid,key,value){
firebase.database().ref().child('users').child(uid).
update(_defineProperty({},key,value));
}

_exports.getUser=function(key){
return firebase.database().ref().child('users').child(key).once('value').
then(function(snap){return snap.val();});
};

function getUserCb(key,func){
firebase.database().ref().child('users').child(key).once('value').
then(function(snap){return func(snap.val());});
}

function getUsersCb(keyArray,func){
firebase.database().ref().child('users').once('value').
then(function(snap){
if(snap.val()!=null){
var users=[];

keyArray.forEach(function(key){
users.push(snap.val()[key]);
});

func(users);
}
});
}

function getChat(key){
return firebase.database().ref().child('messages').child(key).once('value').
then(function(snap){return snap.val();});
}

function getChatCb(key,func){
return firebase.database().ref().child('messages').child(key).once('value').
then(function(snap){func(snap.val());});
}

function getChatsCb(keyArray,func){
firebase.database().ref().child('messages').once('value').
then(function(snap){
if(snap.val()!=null){
var chats=[];

keyArray.forEach(function(key){
chats.push(snap.val()[key]);
});

func(chats);
}
});
}

function getChatMessageCountFromUid(chatID,uid){
firebase.database().ref().child('messages').child(key).once('value').
then(function(snap){
var messageCount=Object.values(snap.val()).filter(function(message){
return message.sender==uid;
}).length;

return messageCount;
});
}

function getChatWithProfiles(userKey,profileKey,func){

var uidArray=[userKey,profileKey];
uidArray.sort();
var chatID=uidArray[0]+'-'+uidArray[1];

getChatCb(chatID,function(chat){func(chat);});
}

function getChatIDsWithProfilesAndUser(userKey,profileKeyArray,func){
var chatIDs=[];

profileKeyArray.forEach(function(profileKey){
var uidArray=[userKey,profileKey];
uidArray.sort();
var chatID=uidArray[0]+'-'+uidArray[1];

chatIDs.push(chatID);
});

func(chatIDs);
}


function getProfilesInChatsWithKey(key,func){
return firebase.database().ref().child('messages').once('value').
then(function(snap){
if(snap.val()!=null){
var profileUids=[];

Object.keys(snap.val()).forEach(function(chatID){
if(chatID.split('-').some(function(uid){return uid==key;}))
profileUids.push(chatID.split('-').filter(function(uid){return uid!=key;}));
});

getUsersCb(profileUids,function(profiles){func(profiles);});
}
});
}

function checkForChat(userKey,profileKey,func){
firebase.database().ref().child('messages').once('value').
then(function(snap){
if(snap.val()!=null){
var hasChat=false;

Object.keys(snap.val()).forEach(function(chatID){
if(chatID.split('-').some(function(uid){return uid==userKey;})&&chatID.split('-').some(function(uid){return uid==profileKey;}))
hasChat=true;
});

func(hasChat);
}
});
}

function watchForNewChat(userKey,profileKey,func){
firebase.database().ref().child('messages').on('value',function(snap){
if(snap.val()!=null){
var hasChat=false;

Object.keys(snap.val()).forEach(function(chatID){
if(chatID.split('-').some(function(uid){return uid==userKey;})&&chatID.split('-').some(function(uid){return uid==profileKey;})){
hasChat=true;
}
});

func(hasChat);
}
});
}

function watchChat(key,func){
firebase.database().ref().child('messages').child(key).on('value',function(snap){
if(snap.val()!=null){
func(snap.val());
}
});
}

function removeWatchForChat(){
firebase.database().ref().child('messages').off();
}

function watchChatForRecentMessage(key,func){
firebase.database().ref().child('message').child(key).on('value',function(snap){
if(snap.val()!=null){
console.log('snapaf slkdjfalskdfjlkasjf');
console.log(snap.val()[0]);
func(snap.val()[0]);
}
});
}


function watchChatsWithProfilesInKey(key,func){
return firebase.database().ref().child('messages').on('value',function(snap){
if(snap.val()!=null){
var profileUids=[];

Object.keys(snap.val()).forEach(function(chatID){
if(chatID.split('-').some(function(uid){return uid==key;}))
profileUids.push(chatID.split('-').filter(function(uid){return uid!=key;}));
});

getUsersCb(profileUids,function(profiles){func(profiles);});
}
});
}

function turnOffChatListener(){
return firebase.database().ref().child('messages').off();
}


function getAllUsers(func){
firebase.database().ref().child('users').once('value').
then(function(snap){
if(snap.val()!=null){
if(snap.val()!=null)
getUsersCb(Object.keys(snap.val()),function(profiles){
if(profiles!=null)
func(profiles);
});else

func(null);
}
});
}

function watchUser(key,func){
firebase.database().ref().child('users/'+key).on('value',function(snap){
func(snap.val());
});
}

function removeWatchUser(key){
firebase.database().ref().child('users/'+key).off();
}