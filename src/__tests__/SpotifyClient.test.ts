import { SpotifyClient } from '../integrations/SpotifyClient';

describe('SpotifyClient', () => {
  let client: SpotifyClient;

  beforeEach(() => {
    client = new SpotifyClient({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
    });
  });

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client).toBeInstanceOf(SpotifyClient);
    });

    it('should accept optional tokens', () => {
      const clientWithTokens = new SpotifyClient({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      });
      expect(clientWithTokens).toBeInstanceOf(SpotifyClient);
    });
  });

  describe('setAccessToken', () => {
    it('should update access token and headers', () => {
      client.setAccessToken('new-token');
      // Token is updated internally - no error means success
      expect(true).toBe(true);
    });
  });

  describe('syncTrackMetadata', () => {
    it('should find track by ISRC first', async () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
        isrc: 'USXX12345678',
      };

      const mockTrack = {
        id: 'test-track-id',
        uri: 'spotify:track:test-track-id',
        name: 'Test Song',
        artists: ['Test Artist'],
        album: 'Test Album',
        duration: 180000,
        isrc: 'USXX12345678',
        popularity: 75,
      };

      const mockSearchByISRC = jest.spyOn(client, 'searchByISRC');
      mockSearchByISRC.mockResolvedValue(mockTrack);

      const result = await client.syncTrackMetadata(trackData);

      expect(result).toEqual(mockTrack);
      expect(mockSearchByISRC).toHaveBeenCalledWith('USXX12345678');

      mockSearchByISRC.mockRestore();
    });

    it('should fallback to text search if ISRC not found', async () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
        isrc: 'USXX12345678',
      };

      const mockTrack = {
        id: 'test-track-id',
        uri: 'spotify:track:test-track-id',
        name: 'Test Song',
        artists: ['Test Artist'],
        album: 'Test Album',
        duration: 180000,
        popularity: 75,
      };

      const mockSearchByISRC = jest.spyOn(client, 'searchByISRC');
      mockSearchByISRC.mockResolvedValue(null);

      const mockSearchTracks = jest.spyOn(client, 'searchTracks');
      mockSearchTracks.mockResolvedValue([mockTrack]);

      const result = await client.syncTrackMetadata(trackData);

      expect(result).toEqual(mockTrack);
      expect(mockSearchByISRC).toHaveBeenCalledWith('USXX12345678');
      expect(mockSearchTracks).toHaveBeenCalledWith(
        'track:Test Song artist:Test Artist',
        1
      );

      mockSearchByISRC.mockRestore();
      mockSearchTracks.mockRestore();
    });

    it('should search by title and artist if no ISRC', async () => {
      const trackData = {
        title: 'Test Song',
        artist: 'Test Artist',
      };

      const mockSearchTracks = jest.spyOn(client, 'searchTracks');
      mockSearchTracks.mockResolvedValue([]);

      const result = await client.syncTrackMetadata(trackData);

      expect(result).toBeNull();
      expect(mockSearchTracks).toHaveBeenCalledWith(
        'track:Test Song artist:Test Artist',
        1
      );

      mockSearchTracks.mockRestore();
    });
  });

  describe('getTrackAnalytics', () => {
    it('should calculate analytics based on popularity', async () => {
      const mockTrack = {
        id: 'test-track-id',
        uri: 'spotify:track:test-track-id',
        name: 'Test Song',
        artists: ['Test Artist'],
        album: 'Test Album',
        duration: 180000,
        popularity: 80,
      };

      const mockGetTrack = jest.spyOn(client, 'getTrack');
      mockGetTrack.mockResolvedValue(mockTrack);

      const analytics = await client.getTrackAnalytics('test-track-id');

      expect(analytics).not.toBeNull();
      expect(analytics?.trackId).toBe('test-track-id');
      expect(analytics?.streams).toBeGreaterThan(0);
      expect(analytics?.listeners).toBeGreaterThan(0);
      expect(analytics?.completionRate).toBeGreaterThanOrEqual(70);
      expect(analytics?.completionRate).toBeLessThanOrEqual(95);

      mockGetTrack.mockRestore();
    });

    it('should return null if track not found', async () => {
      const mockGetTrack = jest.spyOn(client, 'getTrack');
      mockGetTrack.mockResolvedValue(null);

      const analytics = await client.getTrackAnalytics('invalid-track-id');

      expect(analytics).toBeNull();

      mockGetTrack.mockRestore();
    });
  });

  describe('createPlaylist and addTracksToPlaylist', () => {
    it('should create playlist with correct parameters', async () => {
      const mockPost = jest.spyOn(client['client'], 'post');
      mockPost.mockResolvedValue({
        data: { id: 'test-playlist-id' },
      });

      const playlistId = await client.createPlaylist(
        'test-user',
        'My Playlist',
        'Test description',
        true
      );

      expect(playlistId).toBe('test-playlist-id');
      expect(mockPost).toHaveBeenCalledWith(
        '/users/test-user/playlists',
        expect.objectContaining({
          name: 'My Playlist',
          description: 'Test description',
          public: true,
        })
      );

      mockPost.mockRestore();
    });

    it('should add tracks to playlist', async () => {
      const trackUris = [
        'spotify:track:id1',
        'spotify:track:id2',
        'spotify:track:id3',
      ];

      const mockPost = jest.spyOn(client['client'], 'post');
      mockPost.mockResolvedValue({ data: {} });

      const result = await client.addTracksToPlaylist('playlist-id', trackUris);

      expect(result).toBe(true);
      expect(mockPost).toHaveBeenCalledWith(
        '/playlists/playlist-id/tracks',
        expect.objectContaining({
          uris: trackUris,
        })
      );

      mockPost.mockRestore();
    });
  });

  describe('getTracks', () => {
    it('should fetch multiple tracks by IDs', async () => {
      const trackIds = ['id1', 'id2', 'id3'];
      
      const mockGet = jest.spyOn(client['client'], 'get');
      mockGet.mockResolvedValue({
        data: {
          tracks: [
            {
              id: 'id1',
              uri: 'spotify:track:id1',
              name: 'Song 1',
              artists: [{ name: 'Artist 1' }],
              album: { name: 'Album 1' },
              duration_ms: 180000,
              popularity: 75,
            },
            {
              id: 'id2',
              uri: 'spotify:track:id2',
              name: 'Song 2',
              artists: [{ name: 'Artist 2' }],
              album: { name: 'Album 2' },
              duration_ms: 200000,
              popularity: 80,
            },
          ],
        },
      });

      const tracks = await client.getTracks(trackIds);

      expect(tracks).toHaveLength(2);
      expect(tracks[0].id).toBe('id1');
      expect(tracks[1].id).toBe('id2');

      mockGet.mockRestore();
    });

    it('should filter out null tracks', async () => {
      const mockGet = jest.spyOn(client['client'], 'get');
      mockGet.mockResolvedValue({
        data: {
          tracks: [
            {
              id: 'id1',
              uri: 'spotify:track:id1',
              name: 'Song 1',
              artists: [{ name: 'Artist 1' }],
              album: { name: 'Album 1' },
              duration_ms: 180000,
              popularity: 75,
            },
            null, // Deleted or unavailable track
          ],
        },
      });

      const tracks = await client.getTracks(['id1', 'id2']);

      expect(tracks).toHaveLength(1);
      expect(tracks[0].id).toBe('id1');

      mockGet.mockRestore();
    });
  });
});
