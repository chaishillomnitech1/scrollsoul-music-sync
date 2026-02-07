/**
 * Template Marketplace Service
 * Manages video templates for NFT content generation
 */

export type TemplateCategory = 'cinematic' | 'minimal' | 'energetic' | 'luxury' | 'retro';
export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export interface Font {
  family: string;
  weight: string;
  url?: string;
}

export interface TemplateConfig {
  colorPalette: string[];
  fonts: Font[];
  transitionStyle: string;
  musicGenre: string;
  duration: number;
  aspectRatio: AspectRatio;
}

export interface Creator {
  id: string;
  name: string;
  email: string;
}

export interface VideoTemplate {
  id: string;
  name: string;
  creator: Creator;
  price: number; // 0 for free
  category: TemplateCategory;
  config: TemplateConfig;
  previewUrl: string;
  thumbnailUrl?: string;
  downloads: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface TemplateReview {
  id: string;
  templateId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
}

export class TemplateMarketplace {
  private templates: Map<string, VideoTemplate> = new Map();
  private reviews: Map<string, TemplateReview[]> = new Map();
  private purchases: Map<string, Set<string>> = new Map(); // userId -> templateIds

  constructor() {
    // Initialize with some free templates
    this.seedFreeTemplates();
  }

  /**
   * Create a new template
   */
  async createTemplate(data: Omit<VideoTemplate, 'id' | 'downloads' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<VideoTemplate> {
    const template: VideoTemplate = {
      id: this.generateId(),
      ...data,
      downloads: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    };

    this.templates.set(template.id, template);
    return template;
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId: string): Promise<VideoTemplate | undefined> {
    return this.templates.get(templateId);
  }

  /**
   * Search templates
   */
  async searchTemplates(filters?: {
    category?: TemplateCategory;
    maxPrice?: number;
    minRating?: number;
    tags?: string[];
  }): Promise<VideoTemplate[]> {
    let templates = Array.from(this.templates.values()).filter((t) => t.isActive);

    if (filters?.category) {
      templates = templates.filter((t) => t.category === filters.category);
    }

    if (filters?.maxPrice !== undefined) {
      templates = templates.filter((t) => t.price <= filters.maxPrice!);
    }

    if (filters?.minRating) {
      templates = templates.filter((t) => t.rating >= filters.minRating!);
    }

    if (filters?.tags && filters.tags.length > 0) {
      templates = templates.filter((t) => 
        filters.tags!.some((tag) => t.tags.includes(tag))
      );
    }

    return templates;
  }

  /**
   * Purchase template
   */
  async purchaseTemplate(userId: string, templateId: string): Promise<boolean> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Get user's purchased templates
    let purchased = this.purchases.get(userId);
    if (!purchased) {
      purchased = new Set<string>();
      this.purchases.set(userId, purchased);
    }

    // Check if already purchased
    if (purchased.has(templateId)) {
      return true; // Already purchased
    }

    // Add to purchases
    purchased.add(templateId);

    // Increment download count
    template.downloads += 1;
    template.updatedAt = new Date();
    this.templates.set(templateId, template);

    // In production, this would process payment via Stripe
    return true;
  }

  /**
   * Check if user has access to template (purchased or free)
   */
  async hasAccess(userId: string, templateId: string): Promise<boolean> {
    const template = this.templates.get(templateId);
    if (!template) {
      return false;
    }

    // Free templates are accessible to everyone
    if (template.price === 0) {
      return true;
    }

    // Check if purchased
    const purchased = this.purchases.get(userId);
    return purchased?.has(templateId) || false;
  }

  /**
   * Add review for template
   */
  async addReview(review: Omit<TemplateReview, 'id' | 'createdAt'>): Promise<TemplateReview> {
    const template = this.templates.get(review.templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    const newReview: TemplateReview = {
      id: this.generateId(),
      ...review,
      createdAt: new Date(),
    };

    // Add review to list
    const templateReviews = this.reviews.get(review.templateId) || [];
    templateReviews.push(newReview);
    this.reviews.set(review.templateId, templateReviews);

    // Update template rating
    const avgRating = templateReviews.reduce((sum, r) => sum + r.rating, 0) / templateReviews.length;
    template.rating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
    template.reviewCount = templateReviews.length;
    template.updatedAt = new Date();
    this.templates.set(template.id, template);

    return newReview;
  }

  /**
   * Get reviews for template
   */
  async getReviews(templateId: string): Promise<TemplateReview[]> {
    return this.reviews.get(templateId) || [];
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit: number = 10): Promise<VideoTemplate[]> {
    const templates = Array.from(this.templates.values())
      .filter((t) => t.isActive)
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);

    return templates;
  }

  /**
   * Get templates by creator
   */
  async getCreatorTemplates(creatorId: string): Promise<VideoTemplate[]> {
    return Array.from(this.templates.values()).filter((t) => t.creator.id === creatorId && t.isActive);
  }

  /**
   * Seed some free templates
   */
  private seedFreeTemplates(): void {
    const freeTemplates: Omit<VideoTemplate, 'id' | 'downloads' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt' | 'isActive'>[] = [
      {
        name: 'Rose Gold Elegance',
        creator: { id: 'scrollsoul', name: 'ScrollSoul', email: 'templates@scrollsoul.com' },
        price: 0,
        category: 'luxury',
        config: {
          colorPalette: ['#B76E79', '#E8C4D1', '#FFD700'],
          fonts: [{ family: 'Playfair Display', weight: '700' }],
          transitionStyle: 'fade',
          musicGenre: 'classical',
          duration: 60,
          aspectRatio: '16:9',
        },
        previewUrl: 'https://preview.scrollsoul.app/rose-gold.mp4',
        tags: ['luxury', 'elegant', 'premium'],
      },
      {
        name: 'Minimal Black',
        creator: { id: 'scrollsoul', name: 'ScrollSoul', email: 'templates@scrollsoul.com' },
        price: 0,
        category: 'minimal',
        config: {
          colorPalette: ['#000000', '#FFFFFF', '#808080'],
          fonts: [{ family: 'Inter', weight: '400' }],
          transitionStyle: 'cut',
          musicGenre: 'ambient',
          duration: 45,
          aspectRatio: '1:1',
        },
        previewUrl: 'https://preview.scrollsoul.app/minimal-black.mp4',
        tags: ['minimal', 'clean', 'modern'],
      },
      {
        name: 'Cinematic Gold',
        creator: { id: 'scrollsoul', name: 'ScrollSoul', email: 'templates@scrollsoul.com' },
        price: 0,
        category: 'cinematic',
        config: {
          colorPalette: ['#1a1a1a', '#FFD700', '#FFA500'],
          fonts: [{ family: 'Montserrat', weight: '600' }],
          transitionStyle: 'zoom',
          musicGenre: 'epic',
          duration: 90,
          aspectRatio: '16:9',
        },
        previewUrl: 'https://preview.scrollsoul.app/cinematic-gold.mp4',
        tags: ['cinematic', 'epic', 'dramatic'],
      },
    ];

    freeTemplates.forEach((templateData) => {
      this.createTemplate(templateData);
    });
  }

  private generateId(): string {
    return `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
