import { RedditPlugin } from './Plugins/reddit';
import { Plugin } from './Plugins/plugin.interface';

const config = require('../config.json');

export let availablePlugins: Plugin[] = [];

config.plugins.forEach(plugin => {
  switch (plugin.name) {
    case 'reddit':
      availablePlugins.push(new RedditPlugin(plugin.command, plugin.subreddits, plugin.limit || 10));
      break;
  }
});
