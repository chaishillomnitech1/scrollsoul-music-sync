import { v4 as uuidv4 } from 'uuid';

/**
 * NFT Collection metadata
 */
export interface NFTCollection {
  address: string;
  name: string;
  totalSupply: number;
  floorPrice: number;
  volume24h: number;
  trending: boolean;
}

/**
 * Content plan item
 */
export interface ContentPlan {
  id: string;
  date: Date;
  contentType: 'nft-showcase' | 'story-chapter' | 'collection-highlight' | 'trending-analysis';
  nftCollection: string;
  topic: string;
  platforms: string[];
  estimatedEngagement: number;
  priority: number;
}

/**
 * Trending topic
 */
export interface TrendingTopic {
  topic: string;
  volume: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  relatedNFTs: string[];
}

/**
 * AI-Powered Content Calendar
 * 
 * Features:
 * - Predict optimal posting times based on audience analytics
 * - Generate 30-day content roadmap
 * - Auto-adapt to trending topics
 * - Seasonal optimization (holidays, events)
 */
export class AIContentCalendar {
  private contentPlans: Map<string, ContentPlan> = new Map();
  private audienceData: Map<string, number[]> = new Map(); // Engagement by hour

  /**
   * Predict optimal posting time based on audience analytics
   */
  predictOptimalPostingTime(nftCollection: string): Date {
    const engagementByHour = this.audienceData.get(nftCollection) || this.getDefaultEngagement();
    
    // Find hour with highest engagement
    const optimalHour = engagementByHour.indexOf(Math.max(...engagementByHour));
    
    // Schedule for optimal hour tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(optimalHour, 0, 0, 0);
    
    return tomorrow;
  }

  /**
   * Generate 30-day content roadmap
   */
  generateMonthlyPlan(collection: NFTCollection): ContentPlan[] {
    const plans: ContentPlan[] = [];
    const startDate = new Date();

    // Generate content plan for 30 days
    for (let day = 0; day < 30; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + day);
      
      // Determine content type based on day of week
      const contentType = this.selectContentType(date);
      
      // Find optimal posting time for this day
      const optimalTime = this.predictOptimalPostingTime(collection.name);
      optimalTime.setDate(date.getDate());
      
      const plan: ContentPlan = {
        id: uuidv4(),
        date: optimalTime,
        contentType,
        nftCollection: collection.address,
        topic: this.generateTopic(collection, contentType, day),
        platforms: this.selectPlatforms(contentType),
        estimatedEngagement: this.estimateEngagement(collection, contentType),
        priority: this.calculatePriority(collection, contentType, day),
      };
      
      plans.push(plan);
      this.contentPlans.set(plan.id, plan);
    }

    return plans;
  }

  /**
   * Incorporate trending topics into content plan
   */
  incorporateTrendingTopics(basePlan: ContentPlan[]): ContentPlan[] {
    const trendingTopics = this.fetchTrendingTopics();
    const updatedPlan = [...basePlan];

    // Replace some planned content with trending topics (20% of plan)
    const trendingCount = Math.floor(basePlan.length * 0.2);
    
    for (let i = 0; i < trendingCount && i < trendingTopics.length; i++) {
      const topic = trendingTopics[i];
      const planIndex = this.findBestSlotForTrending(updatedPlan, topic);
      
      if (planIndex >= 0) {
        updatedPlan[planIndex] = {
          ...updatedPlan[planIndex],
          contentType: 'trending-analysis',
          topic: topic.topic,
          priority: 9, // High priority for trending content
          estimatedEngagement: updatedPlan[planIndex].estimatedEngagement * 1.5,
        };
      }
    }

    return updatedPlan;
  }

  /**
   * Optimize content plan for seasonal events
   */
  optimizeForSeasonality(plan: ContentPlan[]): ContentPlan[] {
    const seasonalEvents = this.getSeasonalEvents();
    const optimizedPlan = [...plan];

    for (const event of seasonalEvents) {
      const relevantPlans = optimizedPlan.filter(
        (p) => this.isWithinEventWindow(p.date, event.date)
      );

      for (const p of relevantPlans) {
        p.topic = `${event.name}: ${p.topic}`;
        p.estimatedEngagement *= event.engagementMultiplier;
        p.priority = Math.min(10, p.priority + 2);
      }
    }

    return optimizedPlan;
  }

  /**
   * Get content plan by ID
   */
  getContentPlan(planId: string): ContentPlan | undefined {
    return this.contentPlans.get(planId);
  }

  /**
   * Update content plan
   */
  updateContentPlan(planId: string, updates: Partial<ContentPlan>): boolean {
    const plan = this.contentPlans.get(planId);
    if (!plan) {
      return false;
    }

    Object.assign(plan, updates);
    return true;
  }

  /**
   * Delete content plan
   */
  deleteContentPlan(planId: string): boolean {
    return this.contentPlans.delete(planId);
  }

  /**
   * Get all content plans
   */
  getAllContentPlans(): ContentPlan[] {
    return Array.from(this.contentPlans.values());
  }

  /**
   * Get upcoming content plans (next 7 days)
   */
  getUpcomingPlans(days: number = 7): ContentPlan[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return Array.from(this.contentPlans.values()).filter(
      (plan) => plan.date >= now && plan.date <= futureDate
    );
  }

  // Private helper methods

  private getDefaultEngagement(): number[] {
    // Default engagement pattern (0-23 hours)
    // Higher engagement in evenings (18-22)
    return [
      2, 1, 1, 1, 2, 3, 5, 7, 8, 6, 5, 6,
      7, 8, 9, 10, 12, 15, 18, 20, 19, 15, 10, 5,
    ];
  }

  private selectContentType(
    date: Date
  ): 'nft-showcase' | 'story-chapter' | 'collection-highlight' | 'trending-analysis' {
    const dayOfWeek = date.getDay();
    
    // Mon/Wed/Fri: NFT showcases
    if ([1, 3, 5].includes(dayOfWeek)) {
      return 'nft-showcase';
    }
    
    // Tue/Thu: Story chapters
    if ([2, 4].includes(dayOfWeek)) {
      return 'story-chapter';
    }
    
    // Sat: Collection highlights
    if (dayOfWeek === 6) {
      return 'collection-highlight';
    }
    
    // Sun: Trending analysis
    return 'trending-analysis';
  }

  private generateTopic(
    collection: NFTCollection,
    contentType: string,
    day: number
  ): string {
    const topics: Record<string, string[]> = {
      'nft-showcase': [
        `Featured ${collection.name} NFT #${day + 1}`,
        `Rare ${collection.name} Gem Discovery`,
        `${collection.name} Spotlight`,
      ],
      'story-chapter': [
        `${collection.name} Lore: Chapter ${Math.floor(day / 7) + 1}`,
        `Behind the Scenes: ${collection.name}`,
        `${collection.name} Creator Journey`,
      ],
      'collection-highlight': [
        `${collection.name} Weekly Roundup`,
        `Top ${collection.name} Sales This Week`,
        `${collection.name} Community Highlights`,
      ],
      'trending-analysis': [
        `${collection.name} Market Analysis`,
        `What's Hot in ${collection.name}`,
        `${collection.name} Trending Now`,
      ],
    };

    const topicList = topics[contentType] || topics['nft-showcase'];
    return topicList[day % topicList.length];
  }

  private selectPlatforms(contentType: string): string[] {
    const platformMap: Record<string, string[]> = {
      'nft-showcase': ['instagram', 'tiktok', 'twitter'],
      'story-chapter': ['youtube', 'instagram', 'vr-space'],
      'collection-highlight': ['youtube', 'twitter', 'instagram'],
      'trending-analysis': ['twitter', 'youtube', 'tiktok'],
    };

    return platformMap[contentType] || ['instagram', 'twitter'];
  }

  private estimateEngagement(collection: NFTCollection, contentType: string): number {
    const baseEngagement = Math.floor(collection.volume24h / 1000);
    
    // Boost for trending collections
    const trendingBoost = collection.trending ? 1.5 : 1.0;
    
    // Different content types have different engagement
    const typeMultiplier: Record<string, number> = {
      'nft-showcase': 1.0,
      'story-chapter': 1.2,
      'collection-highlight': 1.3,
      'trending-analysis': 1.4,
    };

    return Math.floor(
      baseEngagement * trendingBoost * (typeMultiplier[contentType] || 1.0)
    );
  }

  private calculatePriority(
    collection: NFTCollection,
    contentType: string,
    day: number
  ): number {
    let priority = 5;
    
    if (collection.trending) priority += 2;
    if (contentType === 'trending-analysis') priority += 1;
    if (day % 7 === 0) priority += 1; // Weekly highlights
    
    return Math.min(10, priority);
  }

  private fetchTrendingTopics(): TrendingTopic[] {
    // In production, fetch from actual trending data API
    return [
      {
        topic: 'Metaverse Expansion',
        volume: 15000,
        sentiment: 'positive',
        relatedNFTs: [],
      },
      {
        topic: 'AI-Generated Art',
        volume: 12000,
        sentiment: 'positive',
        relatedNFTs: [],
      },
    ];
  }

  private findBestSlotForTrending(plan: ContentPlan[], topic: TrendingTopic): number {
    // Find lowest priority slot
    let lowestPriority = 10;
    let bestIndex = -1;

    for (let i = 0; i < plan.length; i++) {
      if (plan[i].priority < lowestPriority) {
        lowestPriority = plan[i].priority;
        bestIndex = i;
      }
    }

    return bestIndex;
  }

  private getSeasonalEvents(): Array<{
    name: string;
    date: Date;
    engagementMultiplier: number;
  }> {
    const now = new Date();
    const year = now.getFullYear();

    return [
      { name: 'New Year', date: new Date(year, 0, 1), engagementMultiplier: 1.5 },
      { name: 'Valentine\'s Day', date: new Date(year, 1, 14), engagementMultiplier: 1.3 },
      { name: 'Halloween', date: new Date(year, 9, 31), engagementMultiplier: 1.4 },
      { name: 'Black Friday', date: new Date(year, 10, 24), engagementMultiplier: 1.6 },
      { name: 'Christmas', date: new Date(year, 11, 25), engagementMultiplier: 1.5 },
    ];
  }

  private isWithinEventWindow(date: Date, eventDate: Date): boolean {
    const diffTime = Math.abs(date.getTime() - eventDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Within 3 days of event
    return diffDays <= 3;
  }
}
