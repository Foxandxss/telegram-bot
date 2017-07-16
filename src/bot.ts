const TelegramBot = require('node-telegram-bot-api');
import { RedditPlugin } from './Plugins/reddit';
import { Plugin } from './Plugins/plugin.interface';

const config = require('../config.json');

if (!config.token) {
  console.error('You need a token in your config.json');
  process.exit(1);
}

let plugins: Plugin[] = [];

config.plugins.forEach(plugin => {
  switch (plugin.name) {
    case 'reddit':
      plugins.push(new RedditPlugin(plugin.command, plugin.subreddits, plugin.limit || 10));
      break;
  }
});

const bot = new TelegramBot(config.token, {polling: true});

bot.on('message', (msg) => {
  if (msg.text.toLowerCase().indexOf('!') !== 0) return;
  
  const usablePlugins = plugins.filter(p => p.command === msg.text.toLowerCase().substr(1));
  usablePlugins.forEach(up => {
    if (up.fetchInProgress) {
      bot.sendMessage(msg.chat.id, 'Actualización de la base de datos, vuelve a intentarlo');
    } else {
      up.exec().then(image => bot.sendPhoto(msg.chat.id, image));
    }
  });
});
