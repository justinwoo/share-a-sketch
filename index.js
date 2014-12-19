var Hapi = require('hapi');
var Good = require('good');
var redis = require('redis');

var initializeModel = require('./lib/model').initializeModel;
var initializeRoutes = require('./lib/routes').initializeRoutes;

var HOST = process.env.HOST || 'localhost';
var PORT = process.env.PORT || 8000;

var redisClient = redis.createClient();

var model = initializeModel({
  redisClient: redisClient
});

var routes = initializeRoutes({
  model: model
});

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
