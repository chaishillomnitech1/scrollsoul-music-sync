# Blog Post Template: Technical Tutorial

## How to Automate Your Music Distribution with ScrollSoul Music Sync

### Introduction

In this tutorial, you'll learn how to set up and automate your music distribution workflow using ScrollSoul Music Sync. By the end, you'll be able to upload once and distribute to YouTube, TikTok, Spotify, and other platforms automatically.

### Prerequisites

Before you begin, make sure you have:
- [ ] Node.js 14+ installed
- [ ] API keys for platforms you want to integrate
- [ ] Basic knowledge of TypeScript/JavaScript
- [ ] Your music files and metadata ready

### Step 1: Installation

```bash
npm install scrollsoul-music-sync
```

Or using yarn:

```bash
yarn add scrollsoul-music-sync
```

### Step 2: Configuration

Create a `.env` file with your API credentials:

```env
# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CLIENT_ID=your_client_id
YOUTUBE_CLIENT_SECRET=your_client_secret

# TikTok API
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
TIKTOK_ACCESS_TOKEN=your_access_token

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Vydia API
VYDIA_API_KEY=your_vydia_api_key
```

### Step 3: Initialize Platform Clients

```typescript
import { 
  YouTubeClient, 
  TikTokClient, 
  SpotifyClient,
  VydiaClient 
} from 'scrollsoul-music-sync';

// Initialize YouTube
const youtubeClient = new YouTubeClient({
  apiKey: process.env.YOUTUBE_API_KEY,
  clientId: process.env.YOUTUBE_CLIENT_ID,
  clientSecret: process.env.YOUTUBE_CLIENT_SECRET
});

// Initialize TikTok
const tiktokClient = new TikTokClient({
  accessToken: process.env.TIKTOK_ACCESS_TOKEN,
  clientKey: process.env.TIKTOK_CLIENT_KEY,
  clientSecret: process.env.TIKTOK_CLIENT_SECRET
});

// Initialize Spotify
const spotifyClient = new SpotifyClient({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Authenticate
await spotifyClient.authenticate();
```

### Step 4: Prepare Your Track Metadata

```typescript
const trackData = {
  title: "My Awesome Song",
  artist: "Your Artist Name",
  album: "Your Album Name",
  genre: "Electronic",
  releaseDate: "2024-01-01",
  isrc: "USXX12345678",
  duration: 180000 // milliseconds
};
```

### Step 5: Upload to YouTube

```typescript
// Upload video with metadata
const youtubeVideoId = await youtubeClient.uploadVideo({
  file: './path/to/video.mp4',
  metadata: {
    title: `${trackData.artist} - ${trackData.title}`,
    description: `Official music video for ${trackData.title}`,
    tags: [trackData.artist, trackData.genre, 'music'],
    categoryId: '10' // Music category
  },
  privacyStatus: 'public'
});

console.log(`Uploaded to YouTube: ${youtubeVideoId}`);
```

### Step 6: Distribute to TikTok

```typescript
// Sync track to TikTok
const tiktokPublishId = await tiktokClient.syncTrackToVideo(
  'https://your-video-url.mp4',
  trackData
);

// Check publish status
const status = await tiktokClient.checkPublishStatus(tiktokPublishId);
console.log(`TikTok status: ${status.status}`);
```

### Step 7: Sync with Spotify

```typescript
// Search for track on Spotify or upload metadata
const spotifyTrack = await spotifyClient.syncTrackMetadata(trackData);

if (spotifyTrack) {
  console.log(`Found on Spotify: ${spotifyTrack.id}`);
  
  // Get analytics
  const analytics = await spotifyClient.getTrackAnalytics(spotifyTrack.id);
  console.log(`Streams: ${analytics.streams}`);
}
```

### Step 8: Manage with Vydia

```typescript
const vydiaClient = new VydiaClient({
  apiKey: process.env.VYDIA_API_KEY
});

// Create asset on Vydia
const asset = await vydiaClient.createAsset({
  title: trackData.title,
  artist: trackData.artist,
  metadata: trackData
});

console.log(`Vydia asset created: ${asset.id}`);
```

### Step 9: Track Analytics Across Platforms

```typescript
async function getUnifiedAnalytics(trackId: string) {
  const [youtubeStats, tiktokStats, spotifyStats] = await Promise.all([
    youtubeClient.getVideoAnalytics(trackId),
    tiktokClient.getVideoAnalytics(trackId),
    spotifyClient.getTrackAnalytics(trackId)
  ]);

  return {
    youtube: {
      views: youtubeStats.views,
      likes: youtubeStats.likes,
      watchTime: youtubeStats.watchTimeMinutes
    },
    tiktok: {
      views: tiktokStats.views,
      likes: tiktokStats.likes,
      shares: tiktokStats.shares
    },
    spotify: {
      streams: spotifyStats.streams,
      listeners: spotifyStats.listeners,
      saves: spotifyStats.saves
    }
  };
}

const analytics = await getUnifiedAnalytics('your-track-id');
console.log('Unified Analytics:', analytics);
```

### Step 10: Automate with Webhooks

Set up webhooks to automatically sync updates:

```typescript
import express from 'express';

const app = express();
app.use(express.json());

// Vydia webhook handler
app.post('/webhooks/vydia', async (req, res) => {
  const { event, data } = req.body;
  
  if (event === 'asset.created') {
    // Automatically sync new assets to other platforms
    await youtubeClient.syncTrackToVideo(data.videoId, data.metadata);
    await tiktokClient.syncTrackToVideo(data.videoUrl, data.metadata);
  }
  
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Webhook server running on port 3000');
});
```

### Best Practices

1. **Error Handling**: Always wrap API calls in try-catch blocks
2. **Rate Limiting**: Respect platform API rate limits
3. **Metadata Consistency**: Use the same ISRC across all platforms
4. **Backup Data**: Keep local copies of all metadata
5. **Monitor Analytics**: Set up regular analytics checks

### Troubleshooting

**Issue: Authentication Failed**
- Verify your API keys are correct
- Check if tokens have expired
- Ensure proper OAuth flow completion

**Issue: Upload Failed**
- Check file format compatibility
- Verify file size limits
- Ensure stable internet connection

**Issue: Metadata Not Syncing**
- Confirm ISRC is valid
- Check metadata format
- Allow time for platform processing

### Conclusion

You've now learned how to automate your music distribution workflow! With ScrollSoul Music Sync, you can:

✅ Upload once, distribute everywhere
✅ Track analytics across platforms
✅ Automate metadata synchronization
✅ Streamline royalty management

### Next Steps

- Explore the [API Documentation](../api-reference.html)
- Join the [Community Forum](#)
- Share your success story

### Resources

- [GitHub Repository](https://github.com/chaishillomnitech1/scrollsoul-music-sync)
- [API Reference](../api-reference.html)
- [Video Tutorials](#)
- [Community Discord](#)

---

**Questions?** Drop a comment below or reach out on our [Discord community](#).

**Found this helpful?** Share it with fellow musicians! 🎵
