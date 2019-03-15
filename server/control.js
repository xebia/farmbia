global.atob = require('atob');
const Farmbot = require('farmbot').Farmbot;
const path = require('path');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

var API_TOKEN = process.env.API_TOKEN;

let bot = new Farmbot({ token: API_TOKEN });

module.exports = {
  register: sock => {
    const sockProm = new Promise(resolve => {
      sock.on('connection', sockConnection => {
        return resolve(sockConnection);
      });
    });
    Promise.all([sockProm, bot.connect()]).then(([sockConnection, bot]) => {
      console.log('Bot and sock connected');
      bot.on('status', e => {
        console.log('STATUS', e.location_data.position);
        sockConnection.write(
          JSON.stringify({ position: e.location_data.position })
        );

        if (e.informational_settings.locked) {
          // bot.emergencyUnlock();
          // console.log('UNLOCKING AUTOMATICALLY!');
        }
      });

      bot.on('logs', () => {
        // console.log('LOG:', e);
      });

      // return bot.emergencyUnlock();
      // return bot.execSequence(seq.LED_BOX_TEST);
      // return bot.moveRelative({ x: -100, y: 0, z: 0, speed: 100 });
    });
  },
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
