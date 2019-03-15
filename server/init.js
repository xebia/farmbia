const control = require('./control');

module.exports = function(sock) {
  control.register(sock);
};
