const request = require('request-promise-native');
const pr = require('properties-reader');
const control = require('./control');

const env = pr('./.env.local');

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

      // Save token to file so that it is persisted during development
      env.set('API_TOKEN', tokens.token.encoded);
      env.save('.env.local');

      control.initBot(tokens.token.encoded);

      res.send(tokens);
    } catch (e) {
      res.status(e.statusCode).send(e.error);
    }
  },
  async token(req, res) {
    const token = env.get('API_TOKEN');
    if (token) {
      res.json({ token });
    } else {
      res.sendStatus(403);
    }
  }
};
