/**
 * Creator Storefront Service
 * B2C marketplace for creators to offer NFT video generation services
 */

export interface SocialLink {
  platform: 'TWITTER' | 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'DISCORD';
  url: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  createdAt: Date;
}

export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  deliveryTime: number; // days
  price: number;
  currency: string;
  addons: Addon[];
  examples: string[]; // Video URLs
  isActive: boolean;
}

export interface Rating {
  id: string;
  orderId: string;
  rating: number; // 1-5
  review: string;
  createdAt: Date;
  buyerName: string;
}

export interface CreatorProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  socialLinks: SocialLink[];
  portfolio: PortfolioItem[];
  services: Service[];
  ratings: Rating[];
  totalSales: number;
  responseTime: number; // hours
  completionRate: number; // percentage
  isVerified: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  serviceId: string;
  creatorId: string;
  buyerId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'REVISION_REQUESTED' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  price: number;
  currency: string;
  requirements: string;
  deliveryDate: Date;
  revisionsRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatorStorefrontService {
  private creators: Map<string, CreatorProfile> = new Map();
  private orders: Map<string, Order> = new Map();

  /**
   * Create creator profile
   */
  async createCreatorProfile(data: {
    username: string;
    displayName: string;
    bio: string;
    avatar: string;
  }): Promise<CreatorProfile> {
    const profile: CreatorProfile = {
      id: this.generateId(),
      ...data,
      socialLinks: [],
      portfolio: [],
      services: [],
      ratings: [],
      totalSales: 0,
      responseTime: 24, // default 24 hours
      completionRate: 100,
      isVerified: false,
      createdAt: new Date(),
    };

    this.creators.set(profile.id, profile);
    return profile;
  }

  /**
   * Add service to creator profile
   */
  async addService(creatorId: string, service: Omit<Service, 'id' | 'isActive'>): Promise<Service> {
    const creator = this.creators.get(creatorId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    const newService: Service = {
      id: this.generateId(),
      ...service,
      isActive: true,
    };

    creator.services.push(newService);
    this.creators.set(creatorId, creator);

    return newService;
  }

  /**
   * Add portfolio item
   */
  async addPortfolioItem(creatorId: string, item: Omit<PortfolioItem, 'id' | 'createdAt'>): Promise<PortfolioItem> {
    const creator = this.creators.get(creatorId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    const portfolioItem: PortfolioItem = {
      id: this.generateId(),
      ...item,
      createdAt: new Date(),
    };

    creator.portfolio.push(portfolioItem);
    this.creators.set(creatorId, creator);

    return portfolioItem;
  }

  /**
   * Create order
   */
  async createOrder(data: {
    serviceId: string;
    creatorId: string;
    buyerId: string;
    requirements: string;
  }): Promise<Order> {
    const creator = this.creators.get(data.creatorId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    const service = creator.services.find((s) => s.id === data.serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + service.deliveryTime);

    const order: Order = {
      id: this.generateId(),
      ...data,
      status: 'PENDING',
      price: service.price,
      currency: service.currency,
      deliveryDate,
      revisionsRemaining: 3, // default 3 revisions
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.orders.set(order.id, order);
    return order;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.status = status;
    order.updatedAt = new Date();

    // If completed, update creator stats
    if (status === 'COMPLETED') {
      const creator = this.creators.get(order.creatorId);
      if (creator) {
        creator.totalSales += order.price;
        this.creators.set(creator.id, creator);
      }
    }

    this.orders.set(orderId, order);
    return order;
  }

  /**
   * Add rating to creator
   */
  async addRating(creatorId: string, rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> {
    const creator = this.creators.get(creatorId);
    if (!creator) {
      throw new Error('Creator not found');
    }

    const newRating: Rating = {
      id: this.generateId(),
      ...rating,
      createdAt: new Date(),
    };

    creator.ratings.push(newRating);
    this.creators.set(creatorId, creator);

    return newRating;
  }

  /**
   * Get creator profile
   */
  async getCreatorProfile(creatorId: string): Promise<CreatorProfile | undefined> {
    return this.creators.get(creatorId);
  }

  /**
   * Search creators
   */
  async searchCreators(query?: string, minRating?: number): Promise<CreatorProfile[]> {
    let creators = Array.from(this.creators.values());

    if (query) {
      const lowerQuery = query.toLowerCase();
      creators = creators.filter(
        (c) =>
          c.username.toLowerCase().includes(lowerQuery) ||
          c.displayName.toLowerCase().includes(lowerQuery) ||
          c.bio.toLowerCase().includes(lowerQuery)
      );
    }

    if (minRating) {
      creators = creators.filter((c) => {
        const avgRating = this.calculateAverageRating(c);
        return avgRating >= minRating;
      });
    }

    return creators;
  }

  /**
   * Get orders for creator
   */
  async getCreatorOrders(creatorId: string, status?: Order['status']): Promise<Order[]> {
    let orders = Array.from(this.orders.values()).filter((o) => o.creatorId === creatorId);

    if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    return orders;
  }

  /**
   * Get orders for buyer
   */
  async getBuyerOrders(buyerId: string, status?: Order['status']): Promise<Order[]> {
    let orders = Array.from(this.orders.values()).filter((o) => o.buyerId === buyerId);

    if (status) {
      orders = orders.filter((o) => o.status === status);
    }

    return orders;
  }

  /**
   * Calculate average rating for creator
   */
  private calculateAverageRating(creator: CreatorProfile): number {
    if (creator.ratings.length === 0) {
      return 0;
    }

    const sum = creator.ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / creator.ratings.length;
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
