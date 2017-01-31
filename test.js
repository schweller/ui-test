var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'test')));
app.use('/public', express.static(__dirname + '/public'));

app.set('port', port);

app.listen(port, function() {
  var spawn = require('child_process').spawn
  spawn('open', ['http://localhost:' + port + '/runner' ]);
  console.log('Tests available at http://localhost:' + port);
});
