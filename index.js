var Hapi = require('hapi');
var Good = require('good');

var routes = require('./lib/routes');

var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 8000;

var server = new Hapi.Server();

server.connection({
  host: HOST,
  port: PORT
});

server.route(routes);

server.register({
  register: Good,
  options: {
    reporters: [{
      reporter: require('good-console'),
      args:[{ log: '*', response: '*' }]
    }]
  }
}, function (err) {
  if (err) {
    throw err;
  }

  server.start(function () {
    server.log('info', 'Server running at: ' + server.info.uri);
  });
});

server.start();
