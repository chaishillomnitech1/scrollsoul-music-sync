import { TrackService } from '../TrackService';

describe('TrackService', () => {
  let service: TrackService;

  beforeEach(() => {
    service = new TrackService();
  });

  it('should create a track', () => {
    const track = service.createTrack({
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    expect(track).toBeDefined();
    expect(track.title).toBe('Test Track');
  });

  it('should get a track by ID', () => {
    const track = service.createTrack({
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    const retrieved = service.getTrack(track.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(track.id);
  });

  it('should get all tracks', () => {
    service.createTrack({
      title: 'Track 1',
      artist: 'Artist 1',
      duration: 180,
      genre: 'Electronic',
    });

    service.createTrack({
      title: 'Track 2',
      artist: 'Artist 2',
      duration: 200,
      genre: 'Rock',
    });

    const tracks = service.getAllTracks();
    expect(tracks).toHaveLength(2);
  });

  it('should update a track', () => {
    const track = service.createTrack({
      title: 'Original',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    const updated = service.updateTrack(track.id, { title: 'Updated' });
    expect(updated.title).toBe('Updated');
  });

  it('should delete a track', () => {
    const track = service.createTrack({
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    const deleted = service.deleteTrack(track.id);
    expect(deleted).toBe(true);

    const retrieved = service.getTrack(track.id);
    expect(retrieved).toBeUndefined();
  });

  it('should search tracks by criteria', () => {
    service.createTrack({
      title: 'Electronic Track',
      artist: 'DJ Test',
      duration: 180,
      genre: 'Electronic',
      mood: ['energetic', 'uplifting'],
    });

    service.createTrack({
      title: 'Rock Track',
      artist: 'Rock Band',
      duration: 200,
      genre: 'Rock',
      mood: ['intense'],
    });

    const electronicTracks = service.searchTracks({ genre: 'Electronic' });
    expect(electronicTracks).toHaveLength(1);
    expect(electronicTracks[0].genre).toBe('Electronic');

    const energeticTracks = service.searchTracks({ mood: 'energetic' });
    expect(energeticTracks).toHaveLength(1);
  });

  it('should get track count', () => {
    service.createTrack({
      title: 'Track 1',
      artist: 'Artist 1',
      duration: 180,
      genre: 'Electronic',
    });

    expect(service.getTrackCount()).toBe(1);
  });
});
