require("babel-core/register");
require("babel-polyfill");

var express=require("express");
var app=express();
var bodyParser=require("body-parser");

var FirebaseAPI=require('./FirebaseAPI');
var firebase=require("firebase");

var firebaseConfig={
apiKey:"AIzaSyBSfQ2Ux-vZWAcpmjdhCL47Gh7q0HBIpag",
databaseURL:"https://ice-breaker-ad9a9.firebaseio.com",
storageBucket:"ice-breaker-ad9a9.appspot.com"};


app.set('port',process.env.PORT||5000);
app.use(express.static(__dirname+'/public'));

app.use(bodyParser.json());

app.get('/',function(request,response){
response.send('Hello World!');
});

app.post('/notify-message',function(request,response){var _this=this;
var Expo=require("expo-server-sdk");


var expo=new Expo();




var messages=[];

FirebaseAPI.getUserCb(request.body.receiverUid,function(user){

if('pushToken'in user){

if(!Expo.isExpoPushToken(user.pushToken)){
console.log("Push token "+user.pushToken+" is not a valid Expo push token");
}else{
console.log('Sending notification to push token: '+user.pushToken);
}

var bodyString=request.body.senderFirstName+' | "'+request.body.message+'"';


messages.push({
to:user.pushToken,
sound:'default',
body:bodyString,
data:{text:bodyString}});

}
});






var chunks=expo.chunkPushNotifications(messages);

(function _callee(){var _iterator,_isArray,_i,_ref,chunk,receipts;return regeneratorRuntime.async(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_iterator=



chunks,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[typeof Symbol==="function"?typeof Symbol==="function"?Symbol.iterator:"@@iterator":"@@iterator"]();case 1:if(!_isArray){_context.next=7;break;}if(!(_i>=_iterator.length)){_context.next=4;break;}return _context.abrupt("break",25);case 4:_ref=_iterator[_i++];_context.next=11;break;case 7:_i=_iterator.next();if(!_i.done){_context.next=10;break;}return _context.abrupt("break",25);case 10:_ref=_i.value;case 11:chunk=_ref;_context.prev=12;_context.next=15;return regeneratorRuntime.awrap(

expo.sendPushNotificationsAsync(chunk));case 15:receipts=_context.sent;
console.log(request.body);return _context.abrupt("return",
console.log(receipts));case 20:_context.prev=20;_context.t0=_context["catch"](12);return _context.abrupt("return",

console.error(_context.t0));case 23:_context.next=1;break;case 25:case"end":return _context.stop();}}},null,_this,[[12,20]]);})();



});

app.listen(app.get('port'),function(err){
if(err){
return console.log('something bad happened',err);
}

firebase.initializeApp(firebaseConfig);

console.log("Node app is running at localhost:"+app.get('port'));
});