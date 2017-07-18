const path = require('path');
const scrapeIt = require('scrape-it');

export async function scrapeUrl(url: string) {
  const hasExt = path.extname(url);

  // it has url, no need to scrape anything
  if (hasExt) return await Promise.resolve(changeUrl(url));
  
  return await scrapeIt(url, {
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
    
    if (!video) return url;
    
    return video;
  }).catch(err => {
    return undefined;
  });
}

function changeUrl(url: string) {
  if (path.extname(url) === '.webm') {
    return url.replace('.webm', '.mp4');
  }

  if (path.extname(url) === '.gifv') {
    return url.replace('.gifv', '.gif');
  }

  return url;
}
