import { scrapeUrl } from './../Helpers/gifScrapper';
import fetch from 'node-fetch';
const path = require('path');

import { Plugin } from './plugin.interface';

export interface RedditImage {
  url: string;
  permalink: string;
}

export class RedditPlugin implements Plugin {
  private images: RedditImage[] = [];
  private url: string;
  extraMsg: string;
  description: string;
  fetchInProgress = false;

  gifExtensions = ['.webm', '.gif', '.mp4', '.gifv'];

  constructor(public command: string, subreddits: string[], extraMsg, limit = 10) {
    this.url = this.buildUrl(subreddits, limit);
    this.description = `Una imagen aleatoria de los siguientes subreddits: ${subreddits.join(' ')}`;
    this.extraMsg = extraMsg || null;
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
      this.images = this.images.filter(n => n.url.startsWith('http'));
      const promises = this.images.map(scrapeUrl);
      this.images = await Promise.all(promises);
      this.images = this.images.filter(n => n.url); // remove undefined
      this.shuffle(this.images);
      this.fetchInProgress = false;
    }

    if (this.fetchInProgress) {
      bot.sendMessage(msg.chat.id, 'Actualización de la base de datos, vuelve a intentarlo');
    } else {
      const image = this.images.pop();
      const imageExt = path.extname(image.url);
      const fn = this.gifExtensions.includes(imageExt) ? 'sendVideo' : 'sendPhoto';
      console.log(`For the image ${image.url} I am going to use ${fn}`);
      try {
        bot[fn](msg.chat.id, image.url).then(() => {
          bot.sendMessage(msg.chat.id, `https://reddit.com${image.permalink}`, { disable_web_page_preview: true});
          if (this.extraMsg) {
            bot.sendMessage(msg.chat.id, this.extraMsg);
          }
        })
        .catch(() => {
          this.exec(bot, msg);
        });
      } catch (e) {
        this.exec(bot, msg);
      }
    }
  }

  async request(): Promise<RedditImage[]> {
    return await fetch(this.url)
    .then(res => res.json())
    .then(json => json.data.children.map(i => {
      return {
        url: i.data.url,
        permalink: i.data.permalink
      };
    }));
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
