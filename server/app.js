const express = require('express');

const control = require('./control');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app
  .use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .post('/stop', control.stop)
  .post('/unlock', control.unlock)
  .post('/move/:type', control.move)
  .post('/sequence/execute/:id', control.executeSequence)
  .post('/pin/:id', control.writePin)
  .get('*', function(req, res) {
    res.sendStatus(404);
  });

module.exports = app;
