/**
 * YouTube Integration Examples
 * Demonstrates how to use the YouTubeClient for video metadata sync
 */

import { YouTubeClient } from '../src/integrations';
import { TrackMetadata } from '../src/types';

// Initialize YouTube client
const youtubeClient = new YouTubeClient(process.env.YOUTUBE_API_KEY || 'your-api-key');

// Example track
const sampleTrack: TrackMetadata = {
  id: 'track-001',
  title: 'Cosmic Resonance',
  artist: 'ScrollSoul Empire',
  album: 'Omniversal Frequencies',
  duration: 240,
  genre: 'Electronic',
  isrc: 'US-ABC-12-34567',
  releaseDate: new Date('2024-01-01'),
  bpm: 128,
  key: 'A Minor',
  mood: ['energetic', 'uplifting'],
  tags: ['electronic', 'ambient', 'cosmic'],
  audioFileUrl: 'https://example.com/audio/track-001.mp3',
  coverArtUrl: 'https://example.com/covers/track-001.jpg',
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Example 1: Sync track metadata to YouTube video
 */
async function syncTrackToVideo() {
  console.log('=== Example 1: Sync Track to YouTube Video ===\n');

  const videoId = 'dQw4w9WgXcQ';
  
  try {
    const syncStatus = await youtubeClient.syncTrackToVideo(sampleTrack, videoId);
    
    console.log('Sync Status:', syncStatus);
    console.log(`✅ Track synced to video: ${videoId}`);
    console.log(`Status: ${syncStatus.syncStatus}`);
    console.log(`Last Sync: ${syncStatus.lastSyncDate}\n`);
  } catch (error) {
    console.error('❌ Sync failed:', error);
  }
}

/**
 * Example 2: Search for videos using track information
 */
async function searchVideos() {
  console.log('=== Example 2: Search Videos by Track ===\n');

  try {
    const videos = await youtubeClient.searchVideosByTrack(sampleTrack);
    
    console.log(`Found ${videos.length} videos:`);
    videos.forEach((video, index) => {
      console.log(`\n${index + 1}. ${video.title}`);
      console.log(`   Video ID: ${video.videoId}`);
      console.log(`   Views: ${video.viewCount.toLocaleString()}`);
    });
  } catch (error) {
    console.error('❌ Search failed:', error);
  }
}

export { syncTrackToVideo, searchVideos };
