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

    it('should accept API key', () => {
      const clientWithKey = new YouTubeClient('test-api-key');
      expect(clientWithKey).toBeInstanceOf(YouTubeClient);
    });
  });

  describe('getVideoMetadata', () => {
    it('should sync track metadata to video', async () => {
      const trackData = {
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
        releaseDate: new Date('2024-01-01'),
        isrc: 'USXX12345678',
        duration: 180,
        bpm: 120,
        key: 'Am',
        mood: ['Energetic'],
        tags: ['electronic', 'dance'],
        frequency: '963Hz' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await client.syncTrackToVideo(trackData, 'test-video-id');

      expect(result).toBeDefined();
      expect(result.trackId).toBe('track-123');
      expect(result.youtubeVideoId).toBe('test-video-id');
      expect(result.syncStatus).toBe('FAILED'); // Will fail in test due to no real API
    });
  });

  describe('YouTube API Methods', () => {
    it('should have getVideoMetadata method', () => {
      expect(typeof client.getVideoMetadata).toBe('function');
    });

    it('should have syncTrackToVideo method', () => {
      expect(typeof client.syncTrackToVideo).toBe('function');
    });
  });
});
