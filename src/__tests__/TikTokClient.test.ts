import { TikTokClient } from '../integrations/TikTokClient';
import { TrackMetadata } from '../types';

// Mock axios
jest.mock('axios');

describe('TikTokClient', () => {
  let client: TikTokClient;

  beforeEach(() => {
    client = new TikTokClient('test-api-key');
    client = new TikTokClient('test-access-token');
  });

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client).toBeInstanceOf(TikTokClient);
    });
  });

  describe('syncTrack', () => {
    it('should sync track to TikTok sound library', async () => {
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

      const result = await client.syncTrack(trackData);
      
      expect(result).toBeDefined();
      expect(result.trackId).toBe('track-123');
      expect(result.syncStatus).toBeDefined();
  describe('TikTok API Methods', () => {
    it('should have necessary methods', () => {
      expect(typeof client.getSyncStatus).toBe('function');
      expect(typeof client.getMusicAnalytics).toBe('function');
    });
  });
});
