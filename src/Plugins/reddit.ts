import { scrapeUrl } from './../Helpers/gifScrapper';
import fetch from 'node-fetch';
const path = require('path');

import { Plugin } from './plugin.interface';

// http://www.reddit.com/r/legalteens+nipples+gonewild+nsfw+nsfw_gif+tits+realgirls/.json?limit=100

export class RedditPlugin implements Plugin {
  private images: string[] = [];
  private url: string;
  description: string;
  fetchInProgress = false;

  gifExtensions = ['.webm', '.gif', '.mp4', '.gifv'];

  constructor(public command: string, subreddits: string[], limit = 10) {
    this.url = this.buildUrl(subreddits, limit);
    this.description = `Una imagen aleatoria de los siguientes subreddits: ${subreddits.join(' ')}`;
  }

  buildUrl(subreddits: string[], limit: number) {
    return `https://www.reddit.com/r/${subreddits.join('+')}/.json?limit=${limit}`;
  }

  async exec(bot: any, msg: any) {
    // If it is already fetching, just forget about it
    // TODO give back a better result than nothing
    if (this.fetchInProgress) return;
    // Cache is empty
    if (!this.images.length) {
      this.fetchInProgress = true;
      // bot.sendMessage(msg.chat.id, 'Actualizando base de datos. Tardará un poco');
      this.images = await this.request();
      const promises = this.images.map(scrapeUrl);
      this.images = await Promise.all(promises);
      this.images = this.images.filter(n => n); // remove undefined
      this.shuffle(this.images);
      this.fetchInProgress = false;
    }

    if (this.fetchInProgress) {
      bot.sendMessage(msg.chat.id, 'Actualización de la base de datos, vuelve a intentarlo');
    } else {
      const image = this.images.pop();
      console.log(image);
      const imageExt = path.extname(image);
      const fn = this.gifExtensions.includes(imageExt) ? 'sendDocument' : 'sendPhoto';
      console.log(`For the image ${image} I am going to use ${fn}`);
      try {
        bot[fn](msg.chat.id, image);
      } catch (e) {
        console.log('here?');
        this.exec(bot, msg);
      }
    }
  }

  async request() {
    return await fetch(this.url)
    .then(res => res.json())
    .then(json => json.data.children.map(i => i.data.url));
  }

  shuffle(links) {
    let i = links.length,
      j = 0,
      temp;

    while (0 !== i) {
      j = Math.floor(Math.random() * i--);

      temp = links[i];
      links[i] = links[j];
      links[j] = temp;
    }
  }

}
