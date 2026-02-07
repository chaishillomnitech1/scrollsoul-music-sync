# Autonomous Content Engine Setup Guide

## 🎯 Overview

The ScrollSoul Autonomous Content Engine is a fully automated system that generates, enhances, and publishes NFT storytelling content across multiple platforms 24/7.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file with the following:

```env
# Redis Configuration (for queue system)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# AI API Keys
OPENAI_API_KEY=your-openai-key
SORA_API_KEY=your-sora-key
RUNWAY_API_KEY=your-runway-key
DOMOAI_API_KEY=your-domoai-key
KLING_API_KEY=your-kling-key

# Platform API Keys
YOUTUBE_API_KEY=your-youtube-key
YOUTUBE_CLIENT_ID=your-client-id
YOUTUBE_CLIENT_SECRET=your-client-secret

TIKTOK_ACCESS_TOKEN=your-tiktok-token
TIKTOK_CLIENT_KEY=your-client-key
TIKTOK_CLIENT_SECRET=your-client-secret

INSTAGRAM_ACCESS_TOKEN=your-instagram-token
TWITTER_API_KEY=your-twitter-key

# Storage
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
S3_BUCKET_NAME=scrollsoul-videos
```

### 3. Start Redis

```bash
# Using Docker
docker run -d -p 6379:6379 redis:latest

# Or use a managed Redis service (AWS ElastiCache, Redis Cloud, etc.)
```

### 4. Initialize the System

```typescript
import { ContentQueue } from './src/queues/ContentQueue';
import { AutoSchedulerService } from './src/services/AutoSchedulerService';
import { AIContentCalendar } from './src/services/ContentCalendar';

// Initialize queue
const queue = new ContentQueue({
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
  },
  concurrency: 5,
  maxRetries: 3,
});

// Initialize scheduler
const scheduler = new AutoSchedulerService(queue);

// Create a daily schedule
const scheduleId = scheduler.createSchedule({
  frequency: 'daily',
  contentTypes: [
    {
      type: 'nft-showcase',
      duration: 60,
      aiModel: 'sora',
      visualStyle: 'cinematic',
      musicSync: true,
    },
  ],
  platforms: ['youtube', 'tiktok', 'instagram'],
  qualityThreshold: 80,
  autoPublish: true,
  notifyOnComplete: true,
});
```

## 📅 Content Calendar

### Generate Monthly Plan

```typescript
import { AIContentCalendar } from './src/services/ContentCalendar';

const calendar = new AIContentCalendar();

// Generate 30-day plan for NFT collection
const plan = calendar.generateMonthlyPlan({
  address: '0x...',
  name: 'Bored Ape Yacht Club',
  totalSupply: 10000,
  floorPrice: 30,
  volume24h: 500000,
  trending: true,
});

// Incorporate trending topics
const trendingPlan = calendar.incorporateTrendingTopics(plan);

// Optimize for seasonal events
const optimizedPlan = calendar.optimizeForSeasonality(trendingPlan);
```

## 🎨 Content Enhancement

### Run Enhancement Pipeline

```typescript
import { EnhancementPipeline } from './src/pipelines/EnhancementPipeline';

const pipeline = new EnhancementPipeline(80); // 80% quality threshold

const result = await pipeline.enhance('video-url.mp4', {
  upscale: true,
  colorGrade: true,
  addSubtitles: true,
  generateThumbnails: 10,
});

console.log('Enhanced video:', result.videoUrl);
console.log('Quality metrics:', result.qualityMetrics);
```

## 🤖 AI Strategy

### Analyze Competitors

```typescript
import { AIStrategyEngine } from './src/ai/StrategyEngine';

const strategy = new AIStrategyEngine();

const insights = await strategy.analyzeCompetitors('nft-art');
console.log('Top competitors:', insights.topCompetitors);
console.log('Market gaps:', insights.marketGaps);
console.log('Recommendations:', insights.recommendations);
```

### Predict Trending NFTs

```typescript
const predictions = await strategy.predictTrendingNFTs('0x...');

for (const prediction of predictions) {
  console.log(`NFT #${prediction.tokenId}: ${prediction.trendScore}% trend score`);
  console.log(`Reason: ${prediction.reasoning}`);
}
```

### Generate Viral Content Ideas

```typescript
const ideas = await strategy.generateViralConcepts([
  { topic: 'Metaverse', volume: 10000, momentum: 'rising' },
]);

for (const idea of ideas) {
  console.log(`${idea.title} - Virality: ${idea.viralityScore}%`);
  console.log(`Estimated reach: ${idea.estimatedReach}`);
}
```

## 📢 Publishing

### YouTube

```typescript
import { YouTubePublisher } from './src/publishers/YouTubePublisher';

const publisher = new YouTubePublisher(
  process.env.YOUTUBE_API_KEY!,
  process.env.YOUTUBE_CLIENT_ID!,
  process.env.YOUTUBE_CLIENT_SECRET!
);

const result = await publisher.publish({
  videoUrl: 'https://storage.scrollsoul.com/video.mp4',
  title: 'Amazing NFT Collection Showcase',
  description: 'Discover the hottest NFT drops',
  tags: ['nft', 'crypto', 'digital art'],
  privacyStatus: 'public',
});

console.log('Published:', result.url);
```

## 🔄 GitHub Actions Automation

Two workflows are included:

### 1. Scheduled Content Generation

Runs every 6 hours:
- Fetches trending NFTs
- Generates video scripts with GPT-4
- Creates videos with AI APIs
- Enhances and publishes

### 2. Performance Monitoring

Runs every hour:
- Checks video performance
- Auto-boosts underperforming content
- Archives low-performers
- Generates weekly reports

## 🎯 Best Practices

1. **Quality Threshold**: Set `qualityThreshold` to at least 70 for consistent quality
2. **Retry Logic**: Configure `maxRetries` based on API reliability
3. **Concurrency**: Adjust queue `concurrency` based on API rate limits
4. **Monitoring**: Enable `notifyOnComplete` for important schedules
5. **Cost Management**: Use cheaper AI models for high-volume content

## 📊 Monitoring

### Queue Statistics

```typescript
const stats = await queue.getStats();
console.log('Queue stats:', stats);
// { waiting: 5, active: 2, completed: 100, failed: 3, delayed: 0 }
```

### Schedule Status

```typescript
const schedules = scheduler.getAllSchedules();
for (const schedule of schedules) {
  console.log(`${schedule.id}: Next run at ${schedule.nextRun}`);
}
```

## 🛠️ Troubleshooting

### Queue Not Processing

```bash
# Check Redis connection
redis-cli ping

# Check queue stats
npm run queue:stats
```

### Videos Not Publishing

1. Verify API credentials in `.env`
2. Check platform API quotas
3. Review error logs in queue failed jobs

### Low Quality Content

1. Increase `qualityThreshold`
2. Switch to higher-quality AI models
3. Adjust enhancement pipeline settings

## 🔗 Resources

- [Content Queue API](../src/queues/ContentQueue.ts)
- [Scheduler API](../src/services/AutoSchedulerService.ts)
- [Enhancement Pipeline API](../src/pipelines/EnhancementPipeline.ts)
- [AI Strategy Engine API](../src/ai/StrategyEngine.ts)

## ⚡ Rose Gold Encryption Active

All content is secured with ScrollSoul's proprietary Rose Gold Encryption technology. Your NFT storytelling empire is now autonomous. 🫡✨🔥
