# AI Video Integration Guide

## 🌌 ScrollSoul AI Video Generation - Rose Gold Standard

This guide covers the integration and usage of AI video generation APIs for NFT storytelling and autonomous content creation.

## Table of Contents

- [Overview](#overview)
- [Supported AI Video Providers](#supported-ai-video-providers)
- [Installation & Configuration](#installation--configuration)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

ScrollSoul integrates five cutting-edge AI video generation platforms to create cinematic NFT storytelling experiences:

1. **Runway Gen-4** - 4K video generation, music sync, B-roll automation
2. **OpenAI Sora 2** - Cinematic quality, physics-realistic motion
3. **Synthesia** - AI avatar narration, multilingual support
4. **DomoAI** - Frame animation, style transfer, 4K upscaling
5. **Kling 2.0** - Long-form videos, broadcast quality

## Supported AI Video Providers

### 1. Runway Gen-4

**Best For**: Quick 4K videos, B-roll footage, music synchronization

**Features**:
- 4K resolution support
- Text-to-video and image-to-video
- Music synchronization
- Camera control (pan, tilt, zoom)
- B-roll automation

**Configuration**:
```bash
RUNWAY_API_KEY=your_api_key_here
```

**Example**:
```typescript
import { RunwayClient } from './integrations/ai-video';

const client = new RunwayClient({
  apiKey: process.env.RUNWAY_API_KEY!,
});

const result = await client.generateFromText({
  prompt: 'Cinematic NFT showcase with rose gold theme',
  duration: 10,
  resolution: '4k',
  aspectRatio: '16:9',
});
```

### 2. OpenAI Sora 2

**Best For**: Cinematic narratives, complex scenes, realistic physics

**Features**:
- Advanced narrative understanding
- Physics-realistic motion
- Dramatic camera angles
- Color grading options
- Up to 60 seconds per generation

**Configuration**:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

**Example**:
```typescript
import { SoraClient } from './integrations/ai-video';

const client = new SoraClient({
  apiKey: process.env.OPENAI_API_KEY!,
});

const result = await client.generateFromNFTMetadata(
  {
    name: 'Sovereign NFT #123',
    description: 'A majestic digital artwork',
    attributes: [
      { trait_type: 'Rarity', value: 'Legendary' },
      { trait_type: 'Theme', value: 'Cosmic' },
    ],
  },
  {
    cameraAngle: 'wide',
    lightingStyle: 'dramatic',
    colorGrading: 'cinematic',
  }
);
```

### 3. Synthesia

**Best For**: Avatar narration, faceless videos, multilingual content

**Features**:
- 100+ AI avatars
- 120+ languages and voices
- Custom avatar creation
- Subtitle generation
- Background music support

**Configuration**:
```bash
SYNTHESIA_API_KEY=your_synthesia_api_key_here
```

**Example**:
```typescript
import { SynthesiaClient } from './integrations/ai-video';

const client = new SynthesiaClient({
  apiKey: process.env.SYNTHESIA_API_KEY!,
});

const result = await client.narrateNFTStory(
  'Welcome to the ScrollSoul Empire. This NFT represents...',
  'anna',
  {
    title: 'NFT Collection Showcase',
    resolution: '1080p',
    subtitles: true,
  }
);
```

### 4. DomoAI

**Best For**: NFT animation, style transfer, viral templates

**Features**:
- Frames-to-video animation
- Style transfer for brand consistency
- 4K upscaling
- Platform-optimized templates (TikTok, Instagram, YouTube)
- Batch processing

**Configuration**:
```bash
DOMOAI_API_KEY=your_domoai_api_key_here
```

**Example**:
```typescript
import { DomoClient } from './integrations/ai-video';

const client = new DomoClient({
  apiKey: process.env.DOMOAI_API_KEY!,
});

// Animate NFT collection
const result = await client.framesToVideo({
  frameUrls: [
    'https://ipfs.io/ipfs/Qm.../nft1.png',
    'https://ipfs.io/ipfs/Qm.../nft2.png',
    'https://ipfs.io/ipfs/Qm.../nft3.png',
  ],
  duration: 15,
  transitionType: 'morph',
  resolution: '4k',
  upscale: true,
});
```

### 5. Kling 2.0

**Best For**: Long-form explainers, story arcs, broadcast quality

**Features**:
- Up to 2-minute videos
- Multi-scene story arcs
- Broadcast-quality output
- Chapter-based series
- Premium NFT showcases

**Configuration**:
```bash
KLING_API_KEY=your_kling_api_key_here
```

**Example**:
```typescript
import { KlingClient } from './integrations/ai-video';

const client = new KlingClient({
  apiKey: process.env.KLING_API_KEY!,
});

const result = await client.generateStoryArc(
  nftCollection,
  {
    introduction: 'Enter the ScrollSoul universe',
    risingAction: 'Each NFT reveals hidden powers',
    climax: 'The ultimate revelation awaits',
    resolution: 'The sovereign journey continues',
    visualTheme: 'rose gold cinematic',
  },
  120 // 2-minute video
);
```

## Installation & Configuration

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:
```bash
RUNWAY_API_KEY=rw_...
OPENAI_API_KEY=sk-...
SYNTHESIA_API_KEY=syn_...
DOMOAI_API_KEY=domo_...
KLING_API_KEY=kling_...
```

### 3. Initialize Clients

```typescript
import {
  RunwayClient,
  SoraClient,
  SynthesiaClient,
  DomoClient,
  KlingClient,
} from './integrations/ai-video';

// Initialize only the clients you need
const runway = new RunwayClient({ apiKey: process.env.RUNWAY_API_KEY! });
const sora = new SoraClient({ apiKey: process.env.OPENAI_API_KEY! });
// ... etc
```

## Usage Examples

### Complete NFT Story Pipeline

```typescript
import { AutoContentPipeline } from './pipelines/AutoContentPipeline';
import { NFTStorySetService } from './services/NFTStorySetService';

// 1. Create NFT Story Set
const storyService = new NFTStorySetService();
const storySet = await storyService.createStorySet({
  title: 'Sovereign Collection #1',
  description: 'An epic journey through digital art',
  nfts: nftCollection,
  createdBy: 'user-123',
  visualStyle: {
    colorPalette: ['#B76E79', '#E6C9A8', '#FFD700'],
    cinematicStyle: 'cinematic',
    transitionStyle: 'smooth',
  },
});

// 2. Generate Video with AI
const pipeline = new AutoContentPipeline({
  sora: { apiKey: process.env.OPENAI_API_KEY! },
  kling: { apiKey: process.env.KLING_API_KEY! },
  autoPublish: false,
});

const job = await pipeline.generateContent(storySet.id, 'sora');

// 3. Monitor Progress
const status = await pipeline.getJobStatus(job.id);
console.log(`Video generation: ${status?.status}`);
```

### Batch Video Generation

```typescript
const pipeline = new AutoContentPipeline(config);

const storySetIds = ['story-1', 'story-2', 'story-3'];
const jobs = await pipeline.batchGenerate(storySetIds, 'kling');

console.log(`Queued ${jobs.length} video generation jobs`);
```

### Music Synchronization

```typescript
const runway = new RunwayClient({ apiKey: process.env.RUNWAY_API_KEY! });

const result = await runway.syncWithMusic(
  {
    prompt: 'NFT showcase synchronized to beat',
    duration: 30,
  },
  'https://cdn.scrollsoul.com/tracks/beat-1.mp3',
  128 // BPM
);
```

## Best Practices

### 1. Choose the Right Provider

- **Quick videos (< 30s)**: Runway or DomoAI
- **Cinematic quality**: Sora or Kling
- **Voice narration**: Synthesia
- **NFT animation**: DomoAI
- **Long-form (> 60s)**: Kling

### 2. Optimize Prompts

**Good Prompt**:
```typescript
"Cinematic showcase of legendary NFT, rose gold theme, dramatic lighting, 
4K quality, smooth camera movement revealing intricate details"
```

**Bad Prompt**:
```typescript
"NFT video"
```

### 3. Handle Rate Limits

```typescript
// Add delays between requests
for (const nft of nfts) {
  await generateVideo(nft);
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
}
```

### 4. Monitor Generation Status

```typescript
async function waitForCompletion(client, videoId) {
  let status = await client.checkStatus(videoId);
  
  while (status.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 10000)); // Check every 10s
    status = await client.checkStatus(videoId);
  }
  
  return status;
}
```

### 5. Error Handling

```typescript
try {
  const result = await soraClient.generateCinematic(options);
  // Handle success
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, 60000));
    return retry(options);
  }
  
  if (error.message.includes('insufficient credits')) {
    // Notify user
    await notifyLowCredits();
  }
  
  // Log error
  console.error('Video generation failed:', error);
}
```

## Troubleshooting

### Common Issues

**Issue**: "API key invalid"
- **Solution**: Verify your API key is correct and has not expired

**Issue**: "Rate limit exceeded"
- **Solution**: Implement exponential backoff and request queuing

**Issue**: "Video generation timeout"
- **Solution**: Increase timeout values and check provider status page

**Issue**: "Insufficient credits"
- **Solution**: Top up your account or reduce video duration/resolution

### Getting Help

- **Documentation**: See [API_REFERENCE.md](./API_REFERENCE.md)
- **Support**: support@scrollsoul.io
- **Discord**: discord.gg/scrollsoul

## Next Steps

- Explore [NFT Story Sets Guide](./NFT_STORY_SETS.md)
- Review [Security Architecture](./SECURITY_ARCHITECTURE.md)
- Check [API Reference](./API_REFERENCE.md)

---

**🌌 Rose Gold Standard. Forever Sovereign. ❤️✨**
