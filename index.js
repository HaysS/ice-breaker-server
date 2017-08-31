const express = require('express')  
const app = express()  
const port = 80

const FirebaseAPI = require('./FirebaseAPI')
const firebase = require('firebase')

const firebaseConfig = {
  apiKey: "AIzaSyBSfQ2Ux-vZWAcpmjdhCL47Gh7q0HBIpag",
  databaseURL: "https://ice-breaker-ad9a9.firebaseio.com",
  storageBucket: "ice-breaker-ad9a9.appspot.com",
} 

app.get('/', (request, response) => {  
	const Expo = require('expo-server-sdk');

	console.log(response)

	// Create a new Expo SDK client
	const expo = new Expo();

	// FirebaseAPI.getUser('asdfsadf')

	// Create the messages that you want to send to clents
	const messages = [];
	somePushTokens = ["ExponentPushToken[Ah7NMOOuc86HQgHVyGWhM2]"];

	for (const pushToken of somePushTokens) {
	  // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

	  // Check that all your push tokens appear to be valid Expo push tokens
	  if (!Expo.isExpoPushToken(pushToken)) {
	    console.error(`Push token ${pushToken} is not a valid Expo push token`);
	    continue;
	  }

	  // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
	  messages.push({
	    to: pushToken,
	    sound: 'default',
	    body: 'This is a test notification',
	    data: { withSome: 'data' },
	  })
	}

	// The Expo push notification service accepts batches of notifications so
	// that you don't need to send 1000 requests to send 1000 notifications. We
	// recommend you batch your notifications to reduce the number of requests
	// and to compress them (notifications with similar content will get
	// compressed).
	const chunks = expo.chunkPushNotifications(messages);

	(async ()=> {
	  // Send the chunks to the Expo push notification service. There are
	  // different strategies you could use. A simple one is to send one chunk at a
	  // time, which nicely spreads the load out over time:
	  for (const chunk of chunks) {
	    try {
	      var receipts = await expo.sendPushNotificationsAsync(chunk);
	      console.log(receipts);
	    } catch (error) {
	      console.error(error);
	    }
	  }
	})();
})

app.get('/example', (request, response) => {  
	console.log('honestly, my penis is huge')
})

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  firebase.initializeApp(firebaseConfig)

  console.log(`server is listening on ${port}`)
})
