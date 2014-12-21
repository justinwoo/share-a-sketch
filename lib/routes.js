var fs = require('fs');
var joi = require('joi');
var assign = require('object-assign');

var INDEX_HTML = 'dist/index.html';

function makeResponseJSON(status, extraAttributes) {
  var template = {
    status: status
  };
  return assign(template, extraAttributes);
}

function handleError(reply, err) {
  responseBody = makeResponseJSON('error', { error: err });
  reply(responseBody).code(403);
}

function getRandomID() {
  return Math.floor(Math.random() * 1e10).toString(36);
}

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
      var responseBody;
      model.get(id, function (err, value) {
        if (err) {
          handleError(reply, err);
        } else if (value) {
          responseBody = makeResponseJSON('found', { trail: value });
          reply(responseBody);
        } else {
          responseBody = makeResponseJSON('not found');
          reply(responseBody).code(404);
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
          trail: joi.array()
        }
      }
    },
    handler: function (request, reply) {
      var id = getRandomID();
      var trail = request.payload.trail;
      var responseBody;
      model.set(id, trail, function (err, value) {
        if (err) {
          handleError(reply, err);
          reply(responseBody).code(403);
        } else {
          responseBody = makeResponseJSON('created', { id: id });
          reply(responseBody).code(200);
        }
      });
    }
  });

  return routes;
}

module.exports = {
  initializeRoutes: initializeRoutes
};
