const TelegramBot = require('node-telegram-bot-api');

import { availablePlugins } from "./pluginsRegistry";

const config = require('../config.json');

if (!config.token) {
  console.error('You need a token in your config.json');
  process.exit(1);
}

const bot = new TelegramBot(config.token, {polling: true});

bot.on('message', (msg) => {
  try {
    if (!msg.text || msg.text.toLowerCase().indexOf('!') !== 0) return;
    
    const usablePlugins = availablePlugins.filter(p => p.command === msg.text.toLowerCase());
    usablePlugins.forEach(up => {
      up.exec(bot, msg);
    });
  } catch (e) {
    console.error(e);
    console.error("MSG", msg);
  }
});
