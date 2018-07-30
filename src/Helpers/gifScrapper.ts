import { RedditImage } from "../Plugins/reddit";

const path = require('path');
const scrapeIt = require('scrape-it');

export async function scrapeUrl(image: RedditImage) {
  const hasExt = path.extname(image.url);

  // it has url, no need to scrape anything
  if (hasExt) return await Promise.resolve(changeUrl(image));
  
  return await scrapeIt(image.url, {
    video: {
      selector: 'source',
      attr: 'src'
    },
    videoMp4: {
      selector: '#mp4Source',
      attr: 'src'
    }
  }).then(gif => {
    let video: string = gif.videoMp4 ? gif.videoMp4 : gif.video;
    
    if (!video) return image;
    
    // return video;
    return {
      permalink: image.permalink,
      url: video
    };
  }).catch(err => {
    return undefined;
  });
}

function changeUrl(image: RedditImage): RedditImage {
  if (path.extname(image.url) === '.webm') {
    return {
      permalink: image.permalink,
      url: image.url.replace('.webm', '.mp4')
    };
    // return url.replace('.webm', '.mp4');
  }

  if (path.extname(image.url) === '.gifv') {
    return {
      permalink: image.permalink,
      url: image.url.replace('.gifv', '.gif')
    };
    // return image.replace('.gifv', '.gif');
  }

  return image;
}
