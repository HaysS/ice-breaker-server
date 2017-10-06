function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else{obj[key]=value;}return obj;}var firebase=require('firebase');

var _exports=module.exports={};

_exports.getUser=function(key){
return firebase.database().ref().child('users').child(key).once('value').
then(function(snap){return snap.val();});
};

_exports.getUserCb=function(key,func){
firebase.database().ref().child('users').child(key).once('value').
then(function(snap){return func(snap.val());});
};

_exports.setPaid=function(userKey,profileKey){
var now=new Date();

firebase.database().ref().child('users').child(userKey).child("paidProfiles").update(_defineProperty({},profileKey,{date:now}));
};