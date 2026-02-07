/**
 * TikTok Integration Examples
 * Demonstrates TikTokClient for music analytics
 */

import { TikTokClient } from '../src/integrations';

const tiktokClient = new TikTokClient(process.env.TIKTOK_API_KEY || 'your-api-key');

async function getTrendingSounds() {
  const trending = await tiktokClient.getTrendingSounds(20);
  console.log(`Top ${trending.length} Trending Sounds`);
  trending.forEach((sound) => {
    console.log(`#${sound.trendingRank} - ${sound.title} by ${sound.artist}`);
  });
}

export { getTrendingSounds };
