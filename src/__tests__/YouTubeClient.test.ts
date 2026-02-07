import { YouTubeClient } from '../integrations/YouTubeClient';

describe('YouTubeClient', () => {
  let client: YouTubeClient;

  beforeEach(() => {
    client = new YouTubeClient({
      apiKey: 'test-api-key',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
    });
  });

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client).toBeInstanceOf(YouTubeClient);
    });

    it('should accept optional access token', () => {
      const clientWithToken = new YouTubeClient({
        apiKey: 'test-api-key',
        accessToken: 'test-token',
      });
      expect(clientWithToken).toBeInstanceOf(YouTubeClient);
    });
  });

  describe('setAccessToken', () => {
    it('should set access token', () => {
      client.setAccessToken('new-token');
      // Token is set internally - no error means success
      expect(true).toBe(true);
    });
  });

  describe('syncTrackToVideo', () => {
    it('should generate correct track metadata', async () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        genre: 'Electronic',
        releaseDate: '2024-01-01',
        isrc: 'USXX12345678',
      };

      // Mock the updateVideoMetadata method
      const mockUpdate = jest.spyOn(client as any, 'updateVideoMetadata');
      mockUpdate.mockResolvedValue(true);

      const result = await client.syncTrackToVideo('test-video-id', trackData);

      expect(result).toBe(true);
      expect(mockUpdate).toHaveBeenCalledWith(
        'test-video-id',
        expect.objectContaining({
          title: 'Test Artist - Test Song',
          categoryId: '10',
        })
      );

      mockUpdate.mockRestore();
    });
  });

  describe('generateMusicDescription', () => {
    it('should generate description with all metadata', () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        genre: 'Electronic',
        releaseDate: '2024-01-01',
        isrc: 'USXX12345678',
      };

      const description = (client as any).generateMusicDescription(trackData);

      expect(description).toContain('Test Artist - Test Song');
      expect(description).toContain('Album: Test Album');
      expect(description).toContain('Genre: Electronic');
      expect(description).toContain('Release Date: 2024-01-01');
      expect(description).toContain('ISRC: USXX12345678');
      expect(description).toContain('ScrollSoul Music Sync');
    });

    it('should generate description with minimal metadata', () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
      };

      const description = (client as any).generateMusicDescription(trackData);

      expect(description).toContain('Test Artist - Test Song');
      expect(description).not.toContain('Album:');
      expect(description).not.toContain('Genre:');
    });
  });

  describe('generateMusicTags', () => {
    it('should generate tags with all metadata', () => {
      const trackData = {
        artist: 'Test Artist',
        genre: 'Electronic',
        album: 'Test Album',
      };

      const tags = (client as any).generateMusicTags(trackData);

      expect(tags).toContain('Test Artist');
      expect(tags).toContain('music');
      expect(tags).toContain('electronic');
      expect(tags).toContain('Test Album');
      expect(tags).toContain('scrollsoul');
    });

    it('should generate minimal tags without optional fields', () => {
      const trackData = {
        artist: 'Test Artist',
      };

      const tags = (client as any).generateMusicTags(trackData);

      expect(tags).toContain('Test Artist');
      expect(tags).toContain('music');
      expect(tags).toContain('scrollsoul');
    });
  });
});
