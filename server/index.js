global.atob = require('atob');
const path = require('path');
const Farmbot = require('farmbot').Farmbot;
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const TAKE_WEEDER_AND_PUT_BACK = 13728;
const LED_BOX_TEST = 13729;
const TAKE_WATERING_NOZZLE_AND_GIVE_WATER = 14126;
const TAKE_SEEDER_AND_SUCK_SEED = 13812;
const HOVER_ABOVE_SEEDER = 13813;
const TAKE_SEEDER = 13814;
const HOVER_ABOVE_SEED_BIN = 13815;
const TAKE_SEED = 13816;

var API_TOKEN = process.env.API_TOKEN;

let bot = new Farmbot({ token: API_TOKEN });

bot.on('status', (e, name) => {
  console.log('New status:', name, e.location_data.position);
  if (e.informational_settings.locked) {
    bot.emergencyUnlock();
    console.log('UNLOCKING AUTOMATICALLY!');
  }
});

bot
  .connect()
  .then(async function(bot) {
    // return bot.emergencyUnlock();
    return bot.execSequence(LED_BOX_TEST);
    // return bot.moveRelative({ x: -100, y: 0, z: 0, speed: 100 });
  })
  .catch(e => {
    console.log('ERROR', e);
  });
