var chalk = require('chalk');

var KEY_PREFIX = 'share::a::sketch::';

function getKey(input) {
  return KEY_PREFIX + input;
}

function logError(err) {
  console.log(chalk.red('error happened, oops:', err));
}

function initializeModel(options) {
  var client = options.redisClient;
  return {
    get: function (id, callback) {
      client.get(getKey(id), function (err, reply) {
        if (err) {
          logError(err);
        }
        callback(err, reply);
      });
    },
    set: function (id, data, callback) {
      client.set(getKey(id), data, function (err, reply) {
        if (err) {
          logError(err);
        }
        callback(err, reply);
      });
    }
  }
}

module.exports = {
  initializeModel: initializeModel
};
