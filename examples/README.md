# Integration Examples

This directory contains examples demonstrating how to use the ScrollSoul Music Sync platform integrations.

## Available Examples

- `youtube-integration.ts` - YouTube API integration examples
- `tiktok-integration.ts` - TikTok analytics integration examples
- `vr-integration.ts` - VR Space integration examples

## Running Examples

```bash
# Install dependencies
npm install

# Set environment variables
cp ../.env.example ../.env
# Edit .env with your API keys

# Run examples with ts-node
npx ts-node examples/youtube-integration.ts
npx ts-node examples/tiktok-integration.ts
npx ts-node examples/vr-integration.ts
```

## Documentation

See [PLATFORM_INTEGRATIONS.md](../PLATFORM_INTEGRATIONS.md) for comprehensive integration documentation.
