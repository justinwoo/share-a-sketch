var fs = require('fs');
var joi = require('joi');

var INDEX_HTML = 'dist/index.html';

function initializeRoutes(options) {
  var model = options.model;
  var routes = [];

  routes.push({
    method: 'GET',
    path: '/',
    handler: {
      file: function (request) {
        return INDEX_HTML;
      }
    }
  });

  routes.push({
    method: 'GET',
    path: '/sketch/{path*}',
    handler: {
      file: function (request) {
        return INDEX_HTML;
      }
    }
  });

  routes.push({
    method: 'GET',
    path: '/{path*}',
    handler: {
      file: function (request) {
        return 'dist/' + request.params.path;
      }
    }
  });

  routes.push({
    method: 'GET',
    path: '/api',
    handler: function (request, reply) {
      reply('my api here\n');
    }
  });

  routes.push({
    method: 'GET',
    path: '/api/sketch/{id}',
    handler: function (request, reply) {
      var id = request.params.id;
      model.get(id, function (err, value) {
        if (value) {
          reply(value);
        } else {
          reply('not found').code(404);
        }
      });
    }
  });

  routes.push({
    method: 'POST',
    path: '/api/sketch',
    config: {
      validate: {
        params: {
          id: joi.string(),
          data: joi.array()
        }
      }
    },
    handler: function (request, reply) {
      console.log(request.payload.data);
      var id = request.payload.id;
      var data = request.payload.data;
      model.set(id, data, function (err, value) {
        if (err) {
          reply('error: ' + err).code(403);
        } else {
          reply('created').code(200);
        }
      });
    }
  });

  return routes;
}

module.exports = {
  initializeRoutes: initializeRoutes
};
