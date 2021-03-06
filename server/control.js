global.atob = require('atob');
const Farmbot = require('farmbot').Farmbot;
const path = require('path');
const s = require('./sock');

let bot;

module.exports = {
  initBot(token) {
    console.log(
      `Trying to initialize bot with token from ${
        token ? 'login' : 'environment variable'
      }`
    );

    if (!token) {
      require('dotenv').config({
        path: path.resolve(process.cwd(), '.env.local')
      });
      token = process.env.API_TOKEN;
      if (!token) {
        console.log(
          'Could not auto login to FarmBot API. Please set API_TOKEN environment variable'
        );
        return;
      }
    }
    bot = new Farmbot({ token });
    const sockProm = s.get();

    Promise.all([sockProm, bot.connect()]).then(([sockConnection, bot]) => {
      console.log('Bot and sock connected');
      bot.on('legacy_status', e => {
        // console.log('LEGACY STATUS', e);
        sockConnection.write(
          JSON.stringify({
            info: e.informational_settings,
            position: e.location_data.position,
            pins: e.pins
          })
        );

        if (e.informational_settings.locked) {
          // bot.emergencyUnlock();
          // console.log('UNLOCKING AUTOMATICALLY!');
        }
      });

      bot.on('logs', log => {
        // console.log('LOG', log);
        sockConnection.write(JSON.stringify({
          log
        }))
      });

      // return bot.emergencyUnlock();
      // return bot.execSequence(seq.LED_BOX_TEST);
      // return bot.moveRelative({ x: -100, y: 0, z: 0, speed: 100 });
    });
  },
  stop: (req, res) => {
    console.log('Stop!');
    bot.emergencyLock();
    res.status(200).json({});
  },
  unlock: (req, res) => {
    console.log('Unlock!');
    bot.emergencyUnlock();
    res.status(200).json({});
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
    res.status(200).json({});
  },
  writePin: async (req, res) => {
    console.log(`Writing pin ${req.params.id} => ${req.body.value}`);
    await bot.writePin({
      pin_number: req.params.id,
      pin_value: req.body.value ? 1 : 0,
      pin_mode: 0
    });
    res.status(200).json({});
  },
  executeSequence: (req, res) => {
    console.log('Executing sequence', req.params.id);
    bot.execSequence(req.params.id);
    res.status(200).json({});
  }
};
