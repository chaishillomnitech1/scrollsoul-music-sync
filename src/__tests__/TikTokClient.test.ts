import { TikTokClient } from '../integrations/TikTokClient';

describe('TikTokClient', () => {
  let client: TikTokClient;

  beforeEach(() => {
    client = new TikTokClient('test-access-token');
  });

  describe('Constructor', () => {
    it('should initialize with correct configuration', () => {
      expect(client).toBeInstanceOf(TikTokClient);
    });
  });

  describe('TikTok API Methods', () => {
    it('should have necessary methods', () => {
      expect(typeof client.getSyncStatus).toBe('function');
      expect(typeof client.getMusicAnalytics).toBe('function');
    });
  });
});
