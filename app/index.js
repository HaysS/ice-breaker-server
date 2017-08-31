var express = require('express')
var app = express()

// var IndexAPI = require('./dist/app/indexAPI')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function(err) {
  if (err) {
    return console.log('something bad happened', err)
  }

  // firebase.initializeApp(firebaseConfig)

  console.log("Node app is running at localhost:" + app.get('port'))
})
