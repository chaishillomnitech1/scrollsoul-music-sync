# 🚀 Deployment Guide - ScrollSoul Music Sync Platform

## Overview

This guide provides instructions for deploying the ScrollSoul Music Sync Platform to various environments.

## Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Environment variables configured (see Configuration section)

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# Distribution Partner API Keys
VYDIA_API_KEY=your_vydia_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
NIKE_CAMPAIGN_API_KEY=your_nike_campaign_api_key_here
```

## Local Deployment

1. Clone the repository:
```bash
git clone https://github.com/chaishillomnitech1/scrollsoul-music-sync.git
cd scrollsoul-music-sync
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

## Production Deployment

### Using Node.js

1. Install dependencies:
```bash
npm install --production
```

2. Set NODE_ENV to production:
```bash
export NODE_ENV=production
```

3. Start the server:
```bash
npm start
```

### Using PM2 (Recommended for Production)

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the application:
```bash
pm2 start src/index.js --name scrollsoul-music-sync
```

3. Configure PM2 to start on system boot:
```bash
pm2 startup
pm2 save
```

### Using Docker

1. Create a Dockerfile:
```dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

2. Build and run:
```bash
docker build -t scrollsoul-music-sync .
docker run -p 3000:3000 --env-file .env scrollsoul-music-sync
```

## Cloud Deployment

### Heroku

1. Create a new Heroku app:
```bash
heroku create scrollsoul-music-sync
```

2. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set VYDIA_API_KEY=your_key
heroku config:set SPOTIFY_CLIENT_ID=your_id
heroku config:set SPOTIFY_CLIENT_SECRET=your_secret
```

3. Deploy:
```bash
git push heroku main
```

### AWS Elastic Beanstalk

1. Install EB CLI
2. Initialize application:
```bash
eb init -p node.js scrollsoul-music-sync
```

3. Create environment:
```bash
eb create scrollsoul-music-sync-env
```

4. Deploy:
```bash
eb deploy
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - Build Command: `npm install`
   - Run Command: `npm start`
3. Set environment variables in the dashboard
4. Deploy

## Health Checks

The API provides a health check endpoint at `/health` that returns:

```json
{
  "status": "healthy",
  "timestamp": "2026-02-07T16:47:27.105Z",
  "uptime": 3600
}
```

Use this endpoint for load balancer health checks and monitoring.

## Monitoring

### Logging

The application logs to stdout. In production, use a log aggregation service:

- Heroku: Use Papertrail or Loggly add-ons
- AWS: Use CloudWatch Logs
- Docker: Use the built-in logging driver

### Performance Monitoring

Consider integrating:
- New Relic for application performance monitoring
- Datadog for infrastructure monitoring
- Sentry for error tracking

## Scaling

### Horizontal Scaling

The application is stateless and can be scaled horizontally:

1. Run multiple instances behind a load balancer
2. Use PM2 cluster mode for single-server scaling:
```bash
pm2 start src/index.js -i max --name scrollsoul-music-sync
```

### Database Integration

For production use, replace the in-memory data stores with a database:

1. PostgreSQL for relational data
2. MongoDB for flexible document storage
3. Redis for caching

## Security

1. Always use HTTPS in production
2. Keep environment variables secure
3. Regularly update dependencies
4. Use rate limiting for API endpoints
5. Implement authentication for sensitive endpoints

## Backup and Recovery

1. Regular backups of data (when database is integrated)
2. Version control for code
3. Document recovery procedures

## Troubleshooting

### Server Won't Start

1. Check Node.js version: `node --version`
2. Verify dependencies: `npm install`
3. Check port availability: `lsof -i :3000`

### API Not Responding

1. Check server logs
2. Verify environment variables
3. Test health endpoint: `curl http://localhost:3000/health`

## Support

For issues and support:
- Create an issue on GitHub
- Contact: ScrollSoul Sovereign Empire

---

🌌 **ScrollSoul Music Sync - Deployment Complete** 🌌
