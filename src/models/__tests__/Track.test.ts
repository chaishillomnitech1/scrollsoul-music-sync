import { Track } from '../Track';

describe('Track', () => {
  it('should create a track with valid metadata', () => {
    const track = new Track({
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    expect(track.id).toBeDefined();
    expect(track.title).toBe('Test Track');
    expect(track.artist).toBe('Test Artist');
    expect(track.duration).toBe(180);
    expect(track.genre).toBe('Electronic');
  });

  it('should validate track metadata', () => {
    const validTrack = new Track({
      title: 'Valid Track',
      artist: 'Valid Artist',
      duration: 200,
      genre: 'Rock',
      isrc: 'USRC17607839',
      bpm: 120,
    });

    const validation = validTrack.validate();
    expect(validation.valid).toBe(true);
    expect(validation.errors).toHaveLength(0);
  });

  it('should fail validation for invalid data', () => {
    const invalidTrack = new Track({
      title: '',
      artist: 'Test Artist',
      duration: -10,
      genre: 'Electronic',
      bpm: 500,
    });

    const validation = invalidTrack.validate();
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });

  it('should update track metadata', () => {
    const track = new Track({
      title: 'Original Title',
      artist: 'Original Artist',
      duration: 180,
      genre: 'Electronic',
    });

    track.update({ title: 'Updated Title', bpm: 128 });

    expect(track.title).toBe('Updated Title');
    expect(track.bpm).toBe(128);
  });

  it('should convert to JSON', () => {
    const track = new Track({
      title: 'Test Track',
      artist: 'Test Artist',
      duration: 180,
      genre: 'Electronic',
    });

    const json = track.toJSON();

    expect(json.id).toBe(track.id);
    expect(json.title).toBe('Test Track');
    expect(json.artist).toBe('Test Artist');
  });
});
