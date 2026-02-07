import { YouTubeClient } from '../integrations/YouTubeClient';
import { TrackMetadata } from '../types';

// Mock axios
jest.mock('axios');

describe('YouTubeClient', () => {
  let client: YouTubeClient;

  beforeEach(() => {
    client = new YouTubeClient('test-api-key');
  });

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client).toBeInstanceOf(YouTubeClient);
    });
  });

  describe('syncTrackToVideo', () => {
    it('should sync track metadata to YouTube video', async () => {
      const trackData: TrackMetadata = {
        id: 'track-123',
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        genre: 'Electronic',
        isrc: 'USXX12345678',
        duration: 180,
        bpm: 120,
        releaseDate: new Date('2024-01-01'),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const videoId = 'test-video-id';
      const result = await client.syncTrackToVideo(trackData, videoId);
      
      expect(result).toBeDefined();
      expect(result.trackId).toBe('track-123');
      expect(result.syncStatus).toBeDefined();
    });
  });
});
