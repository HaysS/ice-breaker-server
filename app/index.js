require("babel-core/register");
require("babel-polyfill");

var express = require('express')
var app = express()
const bodyParser = require('body-parser');

const FirebaseAPI = require('./FirebaseAPI')
const firebase = require('firebase')

const firebaseConfig = {
  apiKey: "AIzaSyBSfQ2Ux-vZWAcpmjdhCL47Gh7q0HBIpag",
  databaseURL: "https://ice-breaker-ad9a9.firebaseio.com",
  storageBucket: "ice-breaker-ad9a9.appspot.com",
} 

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json());

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.post('/notify-message', function(request, response) {  
	const Expo = require('expo-server-sdk');

	// Create a new Expo SDK client
	const expo = new Expo();

	// Create the messages that you want to send to clents
	const messages = [];

	// Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(request.body.receiverPushToken)) {
      console.log(`Push token ${request.body.receiverPushToken} is not a valid Expo push token`);
    } else {
    	console.log('Sending notification to push token: '+request.body.receiverPushToken)
    }

    const bodyString = request.body.senderFirstName+' | "'+request.body.message+'"'

    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    messages.push({
      to: request.body.receiverPushToken,
      sound: 'default',
      body: bodyString,
      data: {text: bodyString},
    })

	// The Expo push notification service accepts batches of notifications so
	// that you don't need to send 1000 requests to send 1000 notifications. We
	// recommend you batch your notifications to reduce the number of requests
	// and to compress them (notifications with similar content will get
	// compressed).
	const chunks = expo.chunkPushNotifications(messages);

	(async () => {
	  // Send the chunks to the Expo push notification service. There are
	  // different strategies you could use. A simple one is to send one chunk at a
	  // time, which nicely spreads the load out over time:
	  for (const chunk of chunks) {
	    try {
	      var receipts = await expo.sendPushNotificationsAsync(chunk);
	      console.log(request.body)

	      response.send()
	      
	      return console.log(receipts);
	    } catch (error) {
	      response.send()

	    	
	      return console.error(error);
	    }
	  }
	})();
})

app.post('/notify-match', function(request, response) {  
	const Expo = require('expo-server-sdk');

	// Create a new Expo SDK client
	const expo = new Expo();

	// Create the messages that you want to send to clents
	const messages = [];

	// Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(request.body.receiverPushToken)) {
      console.log(`Push token ${request.body.receiverPushToken} is not a valid Expo push token`);
    } else {
    	console.log('Sending notification to push token: '+request.body.receiverPushToken)
    }

    const bodyString = 'You just matched with '+request.body.senderFirstName+'!'
    // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
    messages.push({
      to: request.body.receiverPushToken,
      sound: 'default',
      body: bodyString,
      data: {text: bodyString},
    })

	// The Expo push notification service accepts batches of notifications so
	// that you don't need to send 1000 requests to send 1000 notifications. We
	// recommend you batch your notifications to reduce the number of requests
	// and to compress them (notifications with similar content will get
	// compressed).
	const chunks = expo.chunkPushNotifications(messages);

	(async () => {
	  // Send the chunks to the Expo push notification service. There are
	  // different strategies you could use. A simple one is to send one chunk at a
	  // time, which nicely spreads the load out over time:
	  for (const chunk of chunks) {
	    try {
	      var receipts = await expo.sendPushNotificationsAsync(chunk);
	      console.log(request.body)

	      response.send()
	      
	      return console.log(receipts);
	    } catch (error) {
	      response.send()

	    	
	      return console.error(error);
	    }
	  }
	})();
})

app.listen(app.get('port'), function(err) {
  if (err) {
    return console.log('something bad happened', err)
  }

  firebase.initializeApp(firebaseConfig)

  console.log("Node app is running at localhost:" + app.get('port'))
})



