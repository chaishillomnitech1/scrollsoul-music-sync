# NFT Story Sets Guide

## 🎨 Create Cinematic NFT Narratives with ScrollSoul

Transform your NFT collections into compelling visual stories with automated AI video generation.

## Table of Contents

- [What are NFT Story Sets?](#what-are-nft-story-sets)
- [Creating Your First Story Set](#creating-your-first-story-set)
- [Story Components](#story-components)
- [Visual Styling](#visual-styling)
- [Auto-Generated Narratives](#auto-generated-narratives)
- [Video Generation](#video-generation)
- [Publishing & Distribution](#publishing--distribution)
- [Examples](#examples)

## What are NFT Story Sets?

NFT Story Sets are curated collections of NFTs combined with:
- **Narrative structure** (chapters, emotional arcs)
- **Visual styling** (color palettes, cinematic themes)
- **Music tracks** (synchronized to video)
- **AI-generated videos** (multiple formats and platforms)
- **Blockchain anchoring** (provenance and metadata)

## Creating Your First Story Set

### Step 1: Initialize the Service

```typescript
import { NFTStorySetService } from './services/NFTStorySetService';

const storyService = new NFTStorySetService();
```

### Step 2: Prepare Your NFTs

```typescript
const myNFTs = [
  {
    id: 'nft-1',
    tokenId: '123',
    contractAddress: '0x...',
    chain: 'ethereum',
    owner: '0x...',
    metadata: {
      name: 'Sovereign #1',
      description: 'First in the legendary collection',
      attributes: [
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Element', value: 'Fire' },
      ],
    },
    imageUrl: 'https://ipfs.io/ipfs/Qm.../1.png',
    createdAt: new Date(),
  },
  // ... more NFTs
];
```

### Step 3: Create the Story Set

```typescript
const storySet = await storyService.createStorySet({
  title: 'The Sovereign Collection',
  description: 'An epic journey through the ScrollSoul universe',
  nfts: myNFTs,
  createdBy: 'your-user-id',
  visualStyle: {
    colorPalette: ['#B76E79', '#E6C9A8', '#FFD700'], // Rose gold theme
    cinematicStyle: 'cinematic',
    transitionStyle: 'smooth',
    textOverlayTemplate: {
      fontFamily: 'Cinzel',
      fontSize: 48,
      color: '#FFD700',
      position: 'bottom',
      animation: 'fade',
    },
  },
  musicTrack: {
    id: 'track-1',
    title: 'Sovereign Anthem',
    artist: 'ScrollSoul',
    duration: 180,
    fileUrl: 'https://cdn.scrollsoul.com/music/anthem.mp3',
    tempo: 120,
    mood: 'epic',
  },
});

console.log('Story Set Created:', storySet.id);
```

## Story Components

### Narrative Structure

Each story set automatically generates a narrative with:

```typescript
interface StoryNarrative {
  synopsis: string;                    // Overall story summary
  chapters: Chapter[];                 // Individual NFT chapters
  voiceoverScript: string;            // Full narration script
  emotionalArc: EmotionalTone[];      // Emotional journey timeline
  targetDuration: number;             // Total video length (seconds)
}
```

### Chapters

Each NFT becomes a chapter in your story:

```typescript
interface Chapter {
  id: string;
  title: string;                      // NFT name
  content: string;                    // NFT description
  nftReferences: string[];            // Related NFT IDs
  duration: number;                   // Chapter length (seconds)
  order: number;                      // Sequence position
}
```

### Emotional Arc

Stories follow a classic emotional journey:

```typescript
const emotionalArc = [
  {
    timestamp: 0,                     // Introduction
    tone: 'mysterious',
    intensity: 6,
  },
  {
    timestamp: 25,                    // Rising action
    tone: 'joyful',
    intensity: 7,
  },
  {
    timestamp: 70,                    // Climax
    tone: 'intense',
    intensity: 9,
  },
  {
    timestamp: 95,                    // Resolution
    tone: 'inspirational',
    intensity: 8,
  },
];
```

## Visual Styling

### Predefined Cinematic Styles

```typescript
type CinematicStyle = 
  | 'cinematic'      // Film-quality, dramatic
  | 'anime'          // Animated, vibrant
  | 'realistic'      // Photo-realistic
  | 'abstract';      // Artistic, conceptual
```

### Transition Styles

```typescript
type TransitionStyle =
  | 'smooth'         // Gentle fades
  | 'dynamic'        // Quick cuts
  | 'glitch'         // Digital effects
  | 'fade';          // Classic fade
```

### Rose Gold Theme (Default)

```typescript
const roseGoldTheme = {
  colorPalette: [
    '#B76E79',  // Rose gold primary
    '#E6C9A8',  // Champagne
    '#FFD700',  // Gold accent
  ],
  cinematicStyle: 'cinematic',
  transitionStyle: 'smooth',
  textOverlayTemplate: {
    fontFamily: 'Cinzel',
    fontSize: 48,
    color: '#FFD700',
    position: 'bottom',
    animation: 'fade',
  },
};
```

## Auto-Generated Narratives

### Default Script Generation

The service automatically creates a voiceover script from NFT metadata:

```typescript
const script = await storyService.generateScriptFromNFTs(myNFTs);

console.log(script);
// Output:
// "Welcome to an exclusive journey through 5 extraordinary NFTs.
// NFT 1: Sovereign #1. First in the legendary collection. Features: Rarity: Legendary, Element: Fire.
// NFT 2: Sovereign #2. ..."
```

### Custom Narrative Updates

Override the auto-generated narrative:

```typescript
await storyService.updateNarrative(storySet.id, {
  synopsis: 'A custom story about...',
  voiceoverScript: 'In the beginning...',
  chapters: [
    {
      id: 'custom-chapter-1',
      title: 'The Awakening',
      content: 'Our journey begins...',
      nftReferences: ['nft-1', 'nft-2'],
      duration: 10,
      order: 0,
    },
  ],
});
```

## Video Generation

### Using the Autonomous Pipeline

```typescript
import { AutoContentPipeline } from './pipelines/AutoContentPipeline';

const pipeline = new AutoContentPipeline({
  sora: { apiKey: process.env.OPENAI_API_KEY! },
  kling: { apiKey: process.env.KLING_API_KEY! },
  synthesia: { apiKey: process.env.SYNTHESIA_API_KEY! },
  autoPublish: false,
  platforms: ['youtube', 'tiktok'],
});

// Generate with Sora (cinematic quality)
const job = await pipeline.generateContent(storySet.id, 'sora');

// Or use Kling for long-form (up to 2 minutes)
const longFormJob = await pipeline.generateContent(storySet.id, 'kling');

// Monitor progress
const status = await pipeline.getJobStatus(job.id);
console.log(`Status: ${status?.status}`);
```

### Batch Generation

Generate videos for multiple story sets:

```typescript
const storySetIds = ['story-1', 'story-2', 'story-3'];
const jobs = await pipeline.batchGenerate(storySetIds, 'sora');

console.log(`Generated ${jobs.length} videos`);
```

## Publishing & Distribution

### Adding Generated Videos

```typescript
const generatedVideo = {
  id: 'video-123',
  url: 'https://cdn.scrollsoul.com/videos/video-123.mp4',
  thumbnailUrl: 'https://cdn.scrollsoul.com/thumbs/video-123.jpg',
  duration: 60,
  resolution: '4k',
  format: 'mp4',
  generatedBy: 'sora',
  generatedAt: new Date(),
  fileSize: 524288000, // 500 MB
  status: 'completed',
};

await storyService.addGeneratedVideo(storySet.id, generatedVideo);
```

### Blockchain Anchoring

Record video generation on blockchain for provenance:

```typescript
const anchor = {
  transactionHash: '0x...',
  blockNumber: 18234567,
  chain: 'ethereum',
  timestamp: new Date(),
  metadataIpfsHash: 'Qm...',
};

await storyService.addBlockchainAnchor(storySet.id, anchor);
```

### Status Management

```typescript
// Update story set status
await storyService.updateStatus(storySet.id, 'processing');

// Available statuses:
// - 'draft'      : Being edited
// - 'processing' : Video generation in progress
// - 'published'  : Live on platforms
// - 'archived'   : No longer active
```

## Examples

### Example 1: Simple NFT Showcase

```typescript
const simpleStory = await storyService.createStorySet({
  title: 'My NFT Collection',
  description: 'Showcase of my favorite pieces',
  nfts: myNFTs.slice(0, 5),
  createdBy: 'creator-123',
});

const job = await pipeline.generateContent(simpleStory.id, 'domoai');
```

### Example 2: Epic Story Arc

```typescript
const epicStory = await storyService.createStorySet({
  title: 'The Chronicles of ScrollSoul',
  description: 'An epic multi-chapter saga',
  nfts: allNFTs,
  createdBy: 'creator-123',
});

// Custom narrative
await storyService.updateNarrative(epicStory.id, {
  synopsis: 'In a world of digital sovereignty...',
  chapters: allNFTs.map((nft, i) => ({
    id: `chapter-${i}`,
    title: `Chapter ${i + 1}: ${nft.metadata.name}`,
    content: `The hero encounters ${nft.metadata.name}...`,
    nftReferences: [nft.id],
    duration: 8,
    order: i,
  })),
});

// Generate long-form video
const job = await pipeline.generateContent(epicStory.id, 'kling');
```

### Example 3: Multilingual Content

```typescript
const globalStory = await storyService.createStorySet({
  title: 'Global NFT Exhibition',
  description: 'Multilingual showcase',
  nfts: myNFTs,
  createdBy: 'creator-123',
});

const synthesia = new SynthesiaClient({
  apiKey: process.env.SYNTHESIA_API_KEY!,
});

const script = await storyService.generateScriptFromNFTs(myNFTs);

// Generate in multiple languages
const videos = await synthesia.generateMultilingualNarration(
  script,
  [
    { code: 'en-US', voice: 'en-US-Neural2-A', script },
    { code: 'es-ES', voice: 'es-ES-Neural2-B', script: spanishScript },
    { code: 'ja-JP', voice: 'ja-JP-Neural2-A', script: japaneseScript },
  ],
  'anna'
);
```

## Management Operations

### List Story Sets

```typescript
// Get all story sets for a user
const userStorySets = await storyService.listStorySets('user-123');

// Get by status
const published = await storyService.getStorySetsByStatus('published');
const drafts = await storyService.getStorySetsByStatus('draft');
```

### Update Story Set

```typescript
await storyService.updateStorySet(storySet.id, {
  title: 'Updated Title',
  description: 'New description',
  visualStyle: {
    ...storySet.visualStyle,
    cinematicStyle: 'anime',
  },
});
```

### Delete Story Set

```typescript
const deleted = await storyService.deleteStorySet(storySet.id);
console.log(`Deleted: ${deleted}`);
```

## Best Practices

1. **Curate Thoughtfully**: Select NFTs that tell a cohesive story
2. **Optimize Duration**: Keep videos under 2 minutes for best engagement
3. **Use Music**: Sync background music to enhance emotional impact
4. **Test Styles**: Try different visual styles to find the best fit
5. **Iterate**: Update narratives based on viewer feedback
6. **Anchor on Blockchain**: Record major milestones for provenance

## Next Steps

- Explore [AI Video Integration](./AI_VIDEO_INTEGRATION.md)
- Review [Security Architecture](./SECURITY_ARCHITECTURE.md)
- Check [API Reference](./API_REFERENCE.md)

---

**🎨 Create. Narrate. Dominate. Rose Gold Standard. ❤️✨**
