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
        callback(err, JSON.parse(reply));
      });
    },
    set: function (id, data, callback) {
      client.set(getKey(id), JSON.stringify(data), function (err, reply) {
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
