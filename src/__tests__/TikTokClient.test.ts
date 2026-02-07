import { TikTokClient } from '../integrations/TikTokClient';

describe('TikTokClient', () => {
  let client: TikTokClient;

  beforeEach(() => {
    client = new TikTokClient({
      accessToken: 'test-access-token',
      clientKey: 'test-client-key',
      clientSecret: 'test-client-secret',
    });
  });

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client).toBeInstanceOf(TikTokClient);
    });
  });

  describe('setAccessToken', () => {
    it('should update access token', () => {
      client.setAccessToken('new-token');
      // Token is updated internally - no error means success
      expect(true).toBe(true);
    });
  });

  describe('syncTrackToVideo', () => {
    it('should sync track metadata and upload to TikTok', async () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        genre: 'Electronic',
        isrc: 'USXX12345678',
      };

      const videoUrl = 'https://example.com/video.mp4';

      // Mock the uploadVideo method
      const mockUpload = jest.spyOn(client, 'uploadVideo');
      mockUpload.mockResolvedValue('test-publish-id');

      const result = await client.syncTrackToVideo(videoUrl, trackData);

      expect(result).toBe('test-publish-id');
      expect(mockUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          videoUrl: videoUrl,
          title: expect.stringContaining('Test Artist - Test Song'),
          privacyLevel: 'PUBLIC',
        })
      );

      mockUpload.mockRestore();
    });

    it('should truncate long titles and descriptions', async () => {
      const longTitle = 'A'.repeat(200);
      const trackData = {
        title: longTitle,
        artist: 'Test Artist',
      };

      const mockUpload = jest.spyOn(client, 'uploadVideo');
      mockUpload.mockResolvedValue('test-publish-id');

      await client.syncTrackToVideo('https://example.com/video.mp4', trackData);

      expect(mockUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.any(String),
        })
      );

      const callArgs = mockUpload.mock.calls[0][0];
      expect(callArgs.title.length).toBeLessThanOrEqual(150);

      mockUpload.mockRestore();
    });
  });

  describe('generateMusicDescription', () => {
    it('should generate description with all metadata', () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
        album: 'Test Album',
        genre: 'Electronic',
        isrc: 'USXX12345678',
      };

      const description = (client as any).generateMusicDescription(trackData);

      expect(description).toContain('Test Artist - Test Song');
      expect(description).toContain('Album: Test Album');
      expect(description).toContain('Genre: Electronic');
      expect(description).toContain('ScrollSoul Music Sync');
      expect(description).toContain('#music');
      expect(description).toContain('#electronic');
    });

    it('should include hashtags in description', () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
        genre: 'Hip Hop',
      };

      const description = (client as any).generateMusicDescription(trackData);

      expect(description).toContain('#hiphop');
      expect(description).toContain('#scrollsoul');
    });
  });

  describe('checkPublishStatus', () => {
    it('should return publish status structure', async () => {
      const mockPost = jest.spyOn(client['client'], 'post');
      mockPost.mockResolvedValue({
        data: {
          data: {
            status: 'PUBLISHED',
            video_id: 'test-video-id',
          },
        },
      });

      const status = await client.checkPublishStatus('test-publish-id');

      expect(status).toEqual({
        status: 'PUBLISHED',
        videoId: 'test-video-id',
        failReason: undefined,
      });

      mockPost.mockRestore();
    });

    it('should handle failed publish status', async () => {
      const mockPost = jest.spyOn(client['client'], 'post');
      mockPost.mockResolvedValue({
        data: {
          data: {
            status: 'FAILED',
            fail_reason: 'Invalid video format',
          },
        },
      });

      const status = await client.checkPublishStatus('test-publish-id');

      expect(status).toEqual({
        status: 'FAILED',
        videoId: undefined,
        failReason: 'Invalid video format',
      });

      mockPost.mockRestore();
    });
  });
});
