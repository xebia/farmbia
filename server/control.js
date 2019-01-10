global.atob = require('atob');
const Farmbot = require('farmbot').Farmbot;
const path = require('path');
// const seq = require('./sequences');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

var API_TOKEN = process.env.API_TOKEN;

let bot = new Farmbot({ token: API_TOKEN });

bot.on('status', e => {
  // console.log('New status:', e.pins['7']);
  if (e.informational_settings.locked) {
    // bot.emergencyUnlock();
    // console.log('UNLOCKING AUTOMATICALLY!');
  }
});
bot.on('logs', e => {
  // console.log('LOG:', e);
});

bot
  .connect()
  .then(async function() {
    // return bot.emergencyUnlock();
    // return bot.execSequence(seq.LED_BOX_TEST);
    // return bot.moveRelative({ x: -100, y: 0, z: 0, speed: 100 });
  })
  .catch(e => {
    console.log('ERROR', e);
  });

module.exports = {
  stop: (req, res) => {
    console.log('Stop!');
    bot.emergencyLock();
    res.sendStatus(200);
  },
  unlock: (req, res) => {
    console.log('Unlock!');
    bot.emergencyUnlock();
    res.sendStatus(200);
  },
  move: (req, res) => {
    const { x, y, z } = req.body;
    if (req.params.type === 'relative') {
      console.log('Moving relative', req.body);
      bot.moveRelative({ x, y, z });
    }
    if (req.params.type === 'absolute') {
      console.log('Moving absolute', req.body);
      bot.moveAbsolute({ x, y, z });
    }
    res.sendStatus(200);
  },
  writePin: async (req, res) => {
    console.log(`Writing pin ${req.params.id} => ${req.body.value}`);
    await bot.writePin({
      pin_number: req.params.id,
      pin_value: req.body.value ? 1 : 0,
      pin_mode: 0
    });
    res.sendStatus(200);
  },
  executeSequence: (req, res) => {
    console.log('Executing sequence', req.params.id);
    bot.execSequence(req.params.id);
    res.sendStatus(200);
  }
};
