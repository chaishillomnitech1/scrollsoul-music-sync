import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Configuration for the Music Sync Platform
 */
export const config = {
  vydiaApiKey: process.env.VYDIA_API_KEY,
  vydiaApiUrl: process.env.VYDIA_API_URL || 'https://api.vydia.com/v1',
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
};
