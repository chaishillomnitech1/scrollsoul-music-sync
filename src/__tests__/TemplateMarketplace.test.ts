import { TemplateMarketplace } from '../templates/TemplateMarketplace';

describe('TemplateMarketplace', () => {
  let marketplace: TemplateMarketplace;

  beforeEach(() => {
    marketplace = new TemplateMarketplace();
  });

  describe('searchTemplates', () => {
    it('should return all free templates', async () => {
      const templates = await marketplace.searchTemplates({ maxPrice: 0 });

      expect(templates.length).toBeGreaterThan(0);
      templates.forEach((t) => {
        expect(t.price).toBe(0);
      });
    });

    it('should filter templates by category', async () => {
      const cinematic = await marketplace.searchTemplates({ category: 'cinematic' });

      expect(cinematic.length).toBeGreaterThan(0);
      cinematic.forEach((t) => {
        expect(t.category).toBe('cinematic');
      });
    });

    it('should filter templates by tags', async () => {
      const luxury = await marketplace.searchTemplates({ tags: ['luxury'] });

      expect(luxury.length).toBeGreaterThan(0);
      luxury.forEach((t) => {
        expect(t.tags).toContain('luxury');
      });
    });
  });

  describe('purchaseTemplate', () => {
    it('should allow purchasing paid template', async () => {
      const template = await marketplace.createTemplate({
        name: 'Premium Template',
        creator: { id: 'creator1', name: 'Creator', email: 'creator@test.com' },
        price: 25,
        category: 'cinematic',
        config: {
          colorPalette: ['#000000'],
          fonts: [],
          transitionStyle: 'fade',
          musicGenre: 'epic',
          duration: 60,
          aspectRatio: '16:9',
        },
        previewUrl: 'https://preview.test.com/premium.mp4',
        tags: ['premium'],
      });

      const purchased = await marketplace.purchaseTemplate('user1', template.id);

      expect(purchased).toBe(true);

      const hasAccess = await marketplace.hasAccess('user1', template.id);
      expect(hasAccess).toBe(true);
    });

    it('should allow free templates without purchase', async () => {
      const templates = await marketplace.searchTemplates({ maxPrice: 0 });
      const freeTemplate = templates[0];

      const hasAccess = await marketplace.hasAccess('user2', freeTemplate.id);

      expect(hasAccess).toBe(true);
    });

    it('should increment download count on purchase', async () => {
      const template = await marketplace.createTemplate({
        name: 'Download Test',
        creator: { id: 'creator2', name: 'Creator', email: 'creator@test.com' },
        price: 10,
        category: 'minimal',
        config: {
          colorPalette: ['#FFFFFF'],
          fonts: [],
          transitionStyle: 'cut',
          musicGenre: 'ambient',
          duration: 30,
          aspectRatio: '1:1',
        },
        previewUrl: 'https://preview.test.com/download.mp4',
        tags: ['test'],
      });

      const initialDownloads = template.downloads;

      await marketplace.purchaseTemplate('user3', template.id);

      const updated = await marketplace.getTemplate(template.id);
      expect(updated?.downloads).toBe(initialDownloads + 1);
    });
  });

  describe('addReview', () => {
    it('should add review and update template rating', async () => {
      const template = await marketplace.createTemplate({
        name: 'Review Test',
        creator: { id: 'creator3', name: 'Creator', email: 'creator@test.com' },
        price: 15,
        category: 'energetic',
        config: {
          colorPalette: ['#FF0000'],
          fonts: [],
          transitionStyle: 'zoom',
          musicGenre: 'electronic',
          duration: 45,
          aspectRatio: '9:16',
        },
        previewUrl: 'https://preview.test.com/review.mp4',
        tags: ['test'],
      });

      await marketplace.addReview({
        templateId: template.id,
        userId: 'user4',
        rating: 5,
        comment: 'Excellent template!',
      });

      await marketplace.addReview({
        templateId: template.id,
        userId: 'user5',
        rating: 4,
        comment: 'Great quality',
      });

      const updated = await marketplace.getTemplate(template.id);
      expect(updated?.rating).toBe(4.5);
      expect(updated?.reviewCount).toBe(2);
    });
  });

  describe('getPopularTemplates', () => {
    it('should return templates sorted by downloads', async () => {
      const popular = await marketplace.getPopularTemplates(5);

      expect(popular.length).toBeGreaterThan(0);
      expect(popular.length).toBeLessThanOrEqual(5);

      // Check if sorted by downloads
      for (let i = 1; i < popular.length; i++) {
        expect(popular[i - 1].downloads).toBeGreaterThanOrEqual(popular[i].downloads);
      }
    });
  });
});
