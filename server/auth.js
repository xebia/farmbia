const request = require('request-promise-native');

let tokens;

module.exports = {
  async login(req, res) {
    try {
      const tokens = await request('https://my.farm.bot/api/tokens', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: {
          user: {
            email: req.body.email,
            password: req.body.password
          }
        },
        json: true
      });

      res.send(tokens);
    } catch (e) {
      res.status(e.statusCode).send(e.error);
    }
  }
};
