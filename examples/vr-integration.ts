/**
 * VR Space Integration Examples
 * Demonstrates VRSpaceClient for immersive experiences
 */

import { VRSpaceClient, VRPlatform } from '../src/integrations';

const vrClient = new VRSpaceClient(process.env.VR_API_KEY || 'your-api-key');

async function getTrendingExperiences() {
  const trending = await vrClient.getTrendingExperiences(10);
  console.log(`Top ${trending.length} Trending VR Experiences`);
  trending.forEach((exp, index) => {
    console.log(`${index + 1}. ${exp.title}`);
    console.log(`   Views: ${exp.viewCount.toLocaleString()}`);
  });
}

export { getTrendingExperiences };
