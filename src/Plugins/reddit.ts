import fetch from 'node-fetch';

import { Plugin } from './plugin.interface';

// http://www.reddit.com/r/legalteens+nipples+gonewild+nsfw+nsfw_gif+tits+realgirls/.json?limit=100

export class RedditPlugin implements Plugin {
  private images: string[] = [];
  private url: string;
  fetchInProgress = false;

  constructor(public command: string, subreddits: string[], limit = 10) {
    this.url = this.buildUrl(subreddits, limit);
  }

  buildUrl(subreddits: string[], limit: number) {
    return `https://www.reddit.com/r/${subreddits.join('+')}/.json?limit=${limit}`;
  }

  async exec() {
    // If it is already fetching, just forget about it
    // TODO give back a better result than nothing
    if (this.fetchInProgress) return;
    // Cache is empty
    if (!this.images.length) {
      this.fetchInProgress = true;
      this.images = await this.request();
      this.shuffle(this.images);
      this.fetchInProgress = false;
    }
    return await Promise.resolve(this.images.pop());
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
