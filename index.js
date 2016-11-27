var express = require('express');
var helmet = require('helmet');
var responseTime = require('response-time');

var app = express();
app.set('port', 3000);

app.use(helmet());
app.use(responseTime());

app.use(express.static(__dirname + '/client'));

app.get('*', function(req, res) {
  res.sendFile(process.cwd() + '/client/index.html');
});

app.listen(app.get('port'));
console.log('Application on port %s', app.get('port'));
console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());