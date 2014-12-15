var routes = [];

var store = {};

routes.push({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('hello world\n');
  }
});

// todo: fix this to support html5 URLs
routes.push({
  method: 'GET',
  path: '/{path*}',
  handler: {
    file: function (request) {
      return request.params.path;
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
    if (store.hasOwnProperty(id)) {
      reply(store[id]);
    } else {
      reply('not found').code(404);
    }
  }
});

routes.push({
  method: 'POST',
  path: '/api/sketch',
  handler: function (request, reply) {
    var id = request.payload.id;
    var data = request.payload.data;
    if (!data && !id) {
      reply('invalid payload').code(403);
    } else {
      store[id] = data;
      reply('created').code(200);
    }
  }
});

module.exports = routes;
