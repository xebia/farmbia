const sockjs = require('sockjs');

let _sock;

module.exports = {
  init(server) {
    console.log('Initialize SockJS');
    const sock = sockjs.createServer({
      sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js'
    });
    sock.installHandlers(server, { prefix: '/updates' });
    _sock = sock;
  },
  get() {
    return new Promise(resolve => {
      _sock.on('connection', sockConnection => {
        return resolve(sockConnection);
      });
    })
  }
};
