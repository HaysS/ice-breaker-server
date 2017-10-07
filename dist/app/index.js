require("babel-core/register");
require("babel-polyfill");

var keyPublishable=process.env.PUBLISHABLE_KEY;
var keySecret=process.env.SECRET_KEY;
var FIREBASE_SECRET="uuiAa6CYs1FOAjEAFgHM8VWais3uZKhqIbHb336R";

var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var path=require("path");

var FirebaseAPI=require('./FirebaseAPI');
var firebase=require("firebase");

var firebaseConfig={
apiKey:"AIzaSyBSfQ2Ux-vZWAcpmjdhCL47Gh7q0HBIpag",
databaseURL:"https://ice-breaker-ad9a9.firebaseio.com",
storageBucket:"ice-breaker-ad9a9.appspot.com"};


var stripe=require("stripe")(keySecret);

app.set("view engine","pug");
app.use(require("body-parser").urlencoded({extended:false}));


app.set('port',process.env.PORT||5000);
app.use(express.static(__dirname+'/public'));

app.use(bodyParser.json());

app.get('/',function(request,response){
response.send('Hello there!');
});

app.post("/pay",function(req,res){
if(req.body.userUid!=undefined&&req.body.profileUid!=undefined){

var paymentText="See "+req.body.profileFirstName+"'s pictures for $5.00.";
res.render("index.pug",{keyPublishable:keyPublishable,paymentText:paymentText,userUid:req.body.userUid,profileUid:req.body.profileUid});
}else{
console.log("Payment form failed");
res.send("Payment form failed");
}
});

app.post("/charge",function(req,res){
if(req.body.userUid!=undefined&&req.body.profileUid!=undefined){
var amount=500;

console.log("User with UID:",req.body.userUid,"Paid for pictures of:",req.body.profileUid);

FirebaseAPI.setPaid(req.body.userUid,req.body.profileUid);

stripe.customers.create({
email:req.body.stripeEmail,
source:req.body.stripeToken}).

then(function(customer){return(
stripe.charges.create({
amount:amount,
description:"Sample Charge",
currency:"usd",
customer:customer.id}));}).

then(function(charge){return res.render("charge.pug");});
}else{
console.log("Charge failed");
res.send("Charge failed");
}
});

app.post('/notify-message',function(request,response){var _this=this;
var Expo=require("expo-server-sdk");


var expo=new Expo();


var messages=[];


if(!Expo.isExpoPushToken(request.body.receiverPushToken)){
console.log("Push token "+request.body.receiverPushToken+" is not a valid Expo push token");
}else{
console.log('Sending notification to push token: '+request.body.receiverPushToken);
}

var bodyString=request.body.senderFirstName+' | "'+request.body.message+'"';


messages.push({
to:request.body.receiverPushToken,
sound:'default',
body:bodyString,
data:{text:bodyString}});







var chunks=expo.chunkPushNotifications(messages);

(function _callee(){var _iterator,_isArray,_i,_ref,chunk,receipts;return regeneratorRuntime.async(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_iterator=



chunks,_isArray=Array.isArray(_iterator),_i=0,_iterator=_isArray?_iterator:_iterator[typeof Symbol==="function"?typeof Symbol==="function"?Symbol.iterator:"@@iterator":"@@iterator"]();case 1:if(!_isArray){_context.next=7;break;}if(!(_i>=_iterator.length)){_context.next=4;break;}return _context.abrupt("break",27);case 4:_ref=_iterator[_i++];_context.next=11;break;case 7:_i=_iterator.next();if(!_i.done){_context.next=10;break;}return _context.abrupt("break",27);case 10:_ref=_i.value;case 11:chunk=_ref;_context.prev=12;_context.next=15;return regeneratorRuntime.awrap(

expo.sendPushNotificationsAsync(chunk));case 15:receipts=_context.sent;
console.log(request.body);

response.send();return _context.abrupt("return",

console.log(receipts));case 21:_context.prev=21;_context.t0=_context["catch"](12);

response.send();return _context.abrupt("return",


console.error(_context.t0));case 25:_context.next=1;break;case 27:case"end":return _context.stop();}}},null,_this,[[12,21]]);})();



});

app.post('/notify-match',function(request,response){var _this2=this;
var Expo=require("expo-server-sdk");


var expo=new Expo();


var messages=[];


if(!Expo.isExpoPushToken(request.body.receiverPushToken)){
console.log("Push token "+request.body.receiverPushToken+" is not a valid Expo push token");
}else{
console.log('Sending notification to push token: '+request.body.receiverPushToken);
}

var bodyString='You just matched with '+request.body.senderFirstName+'!';

messages.push({
to:request.body.receiverPushToken,
sound:'default',
body:bodyString,
data:{text:bodyString}});







var chunks=expo.chunkPushNotifications(messages);

(function _callee2(){var _iterator2,_isArray2,_i2,_ref2,chunk,receipts;return regeneratorRuntime.async(function _callee2$(_context2){while(1){switch(_context2.prev=_context2.next){case 0:_iterator2=



chunks,_isArray2=Array.isArray(_iterator2),_i2=0,_iterator2=_isArray2?_iterator2:_iterator2[typeof Symbol==="function"?typeof Symbol==="function"?Symbol.iterator:"@@iterator":"@@iterator"]();case 1:if(!_isArray2){_context2.next=7;break;}if(!(_i2>=_iterator2.length)){_context2.next=4;break;}return _context2.abrupt("break",27);case 4:_ref2=_iterator2[_i2++];_context2.next=11;break;case 7:_i2=_iterator2.next();if(!_i2.done){_context2.next=10;break;}return _context2.abrupt("break",27);case 10:_ref2=_i2.value;case 11:chunk=_ref2;_context2.prev=12;_context2.next=15;return regeneratorRuntime.awrap(

expo.sendPushNotificationsAsync(chunk));case 15:receipts=_context2.sent;
console.log(request.body);

response.send();return _context2.abrupt("return",

console.log(receipts));case 21:_context2.prev=21;_context2.t0=_context2["catch"](12);

response.send();return _context2.abrupt("return",


console.error(_context2.t0));case 25:_context2.next=1;break;case 27:case"end":return _context2.stop();}}},null,_this2,[[12,21]]);})();



});

app.listen(app.get('port'),function(err){
if(err){
return console.log('something bad happened',err);
}

firebase.initializeApp(firebaseConfig);

console.log("Node app is running at localhost:"+app.get('port'));
});