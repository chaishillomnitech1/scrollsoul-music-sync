import { v4 as uuidv4 } from 'uuid';
import { Industry } from '../sales/PitchGenerator';

/**
 * Marketing campaign type
 */
export enum CampaignType {
  EMAIL = 'EMAIL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  WEBINAR = 'WEBINAR',
  CONTENT = 'CONTENT',
  PAID_ADS = 'PAID_ADS',
}

/**
 * Campaign status
 */
export enum CampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
}

/**
 * Lead status
 */
export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
}

/**
 * Landing page
 */
export interface LandingPage {
  id: string;
  industry: Industry;
  title: string;
  url: string;
  content: {
    hero: string;
    features: string[];
    testimonials: string[];
    cta: string;
  };
  seoMetadata: {
    title: string;
    description: string;
    keywords: string[];
  };
  published: boolean;
  createdAt: Date;
}

/**
 * Email campaign
 */
export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  template: string;
  recipients: string[];
  personalization: Record<string, any>;
  scheduledAt?: Date;
  sentAt?: Date;
  status: CampaignStatus;
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

/**
 * Social media post
 */
export interface SocialMediaPost {
  id: string;
  platform: 'LINKEDIN' | 'TWITTER' | 'FACEBOOK' | 'INSTAGRAM';
  content: string;
  media?: string[];
  hashtags: string[];
  scheduledAt?: Date;
  publishedAt?: Date;
  status: CampaignStatus;
  metrics: {
    impressions: number;
    engagements: number;
    clicks: number;
    shares: number;
  };
}

/**
 * Webinar
 */
export interface Webinar {
  id: string;
  title: string;
  description: string;
  presenters: string[];
  scheduledAt: Date;
  duration: number; // minutes
  registrationUrl: string;
  attendeeLimit?: number;
  registrations: number;
  attendees: number;
  recording?: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
}

/**
 * Sales deck
 */
export interface SalesDeck {
  id: string;
  name: string;
  industry?: Industry;
  slides: {
    title: string;
    content: string;
    layout: 'TITLE' | 'CONTENT' | 'TWO_COLUMN' | 'IMAGE' | 'CHART';
  }[];
  downloadUrl: string;
  createdAt: Date;
}

/**
 * Lead
 */
export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  industry?: Industry;
  source: string;
  status: LeadStatus;
  score: number; // 0-100
  notes: string[];
  createdAt: Date;
  lastActivity: Date;
}

/**
 * Lead nurture sequence
 */
export interface NurtureSequence {
  id: string;
  name: string;
  description: string;
  steps: {
    day: number;
    action: 'EMAIL' | 'CALL' | 'TASK';
    content: string;
  }[];
  activationCriteria: string;
  isActive: boolean;
}

/**
 * Marketing Automation Suite
 * Generate and deploy marketing materials automatically
 */
export class AutomationSuite {
  private landingPages: Map<string, LandingPage> = new Map();
  private emailCampaigns: Map<string, EmailCampaign> = new Map();
  private socialPosts: Map<string, SocialMediaPost> = new Map();
  private webinars: Map<string, Webinar> = new Map();
  private salesDecks: Map<string, SalesDeck> = new Map();
  private leads: Map<string, Lead> = new Map();
  private nurtureSequences: Map<string, NurtureSequence> = new Map();

  constructor() {
    this.initializeNurtureSequences();
  }

  /**
   * Initialize default nurture sequences
   */
  private initializeNurtureSequences() {
    const sequences: Omit<NurtureSequence, 'id'>[] = [
      {
        name: 'New Lead Welcome',
        description: 'Initial outreach sequence for new leads',
        steps: [
          { day: 0, action: 'EMAIL', content: 'Welcome email with platform overview' },
          { day: 2, action: 'EMAIL', content: 'Case study for their industry' },
          { day: 5, action: 'CALL', content: 'Discovery call to understand needs' },
          { day: 7, action: 'EMAIL', content: 'Custom demo invitation' },
          { day: 14, action: 'EMAIL', content: 'Pricing and ROI calculator' },
        ],
        activationCriteria: 'Lead status = NEW',
        isActive: true,
      },
      {
        name: 'Post-Demo Follow-up',
        description: 'Nurture sequence after product demo',
        steps: [
          { day: 0, action: 'EMAIL', content: 'Thank you for demo with recording' },
          { day: 1, action: 'EMAIL', content: 'Technical documentation and integration guide' },
          { day: 3, action: 'CALL', content: 'Follow-up to answer questions' },
          { day: 7, action: 'EMAIL', content: 'Custom quote based on requirements' },
        ],
        activationCriteria: 'Lead attended demo',
        isActive: true,
      },
    ];

    sequences.forEach((seq) => {
      const id = uuidv4();
      this.nurtureSequences.set(id, { ...seq, id });
    });
  }

  /**
   * Generate industry-specific landing page
   */
  generateLandingPage(industry: Industry, companyName?: string): LandingPage {
    const industryContent: Record<Industry, { hero: string; features: string[]; cta: string }> = {
      [Industry.ENTERTAINMENT]: {
        hero: 'Transform Your Entertainment Business with ScrollSoul',
        features: [
          'Automated content distribution to 50+ platforms',
          'Real-time royalty tracking and payments',
          'Comprehensive analytics dashboard',
          'AI-powered content recommendations',
        ],
        cta: 'Start Your Free Trial',
      },
      [Industry.TECHNOLOGY]: {
        hero: 'Developer-First Music Platform for Modern Tech Companies',
        features: [
          'RESTful API with comprehensive documentation',
          'SDKs for 10+ programming languages',
          'Webhook support for real-time updates',
          '99.99% uptime SLA',
        ],
        cta: 'Get API Access',
      },
      [Industry.FITNESS]: {
        hero: 'Legally Licensed Music for Every Workout',
        features: [
          'Unlimited tracks for group fitness classes',
          'Curated workout playlists by BPM',
          'Trainer-friendly mobile app',
          'Member engagement tracking',
        ],
        cta: 'Book a Demo',
      },
      [Industry.RETAIL]: {
        hero: 'Create the Perfect In-Store Experience',
        features: [
          'Pre-cleared music licensing for all locations',
          'Centralized brand soundtrack management',
          'Customer engagement analytics',
          'Easy scheduling and zoning',
        ],
        cta: 'Schedule Consultation',
      },
      [Industry.HOSPITALITY]: {
        hero: 'Elevate Your Guest Experience with Curated Soundscapes',
        features: [
          'AI-curated ambiance playlists',
          'Event-specific music programming',
          'Multi-zone audio control',
          'Guest satisfaction analytics',
        ],
        cta: 'Request Quote',
      },
      [Industry.GAMING]: {
        hero: 'Level Up Your Game with Licensed Music',
        features: [
          'In-game music licensing made simple',
          'Streaming integration support',
          'Player engagement metrics',
          'Dynamic soundtrack system',
        ],
        cta: 'Explore Solutions',
      },
      [Industry.EDUCATION]: {
        hero: 'Music Licensing for Campus Life',
        features: [
          'Event licensing for campus activities',
          'Student engagement programs',
          'Athletic event soundtracks',
          'Compliance documentation',
        ],
        cta: 'Learn More',
      },
      [Industry.HEALTHCARE]: {
        hero: 'Therapeutic Music for Patient Wellness',
        features: [
          'Evidence-based therapeutic playlists',
          'HIPAA-compliant delivery',
          'Patient experience analytics',
          'Customized care environment soundscapes',
        ],
        cta: 'Contact Sales',
      },
      [Industry.CORPORATE]: {
        hero: 'Boost Workplace Productivity with Science-Backed Soundscapes',
        features: [
          'Focus-enhancing audio environments',
          'Employee wellness programs',
          'Event licensing management',
          'Productivity metrics and insights',
        ],
        cta: 'Try It Free',
      },
    };

    const content = industryContent[industry];
    const pageTitle = companyName
      ? `${companyName} - ScrollSoul Platform`
      : `ScrollSoul for ${industry}`;

    const page: LandingPage = {
      id: uuidv4(),
      industry,
      title: pageTitle,
      url: `https://scrollsoul.com/${industry.toLowerCase()}`,
      content: {
        ...content,
        testimonials: [
          'ScrollSoul transformed our business. ROI achieved in 3 months.',
          'Best music platform we\'ve used. Support team is incredible.',
          'Integration was seamless. Up and running in less than a week.',
        ],
      },
      seoMetadata: {
        title: `${pageTitle} | Music Sync Platform`,
        description: `${content.hero}. ${content.features.join('. ')}.`,
        keywords: ['music licensing', 'music platform', industry.toLowerCase(), 'sync licensing'],
      },
      published: false,
      createdAt: new Date(),
    };

    this.landingPages.set(page.id, page);
    return page;
  }

  /**
   * Create email campaign
   */
  createEmailCampaign(
    name: string,
    subject: string,
    template: string,
    recipients: string[],
    personalization?: Record<string, any>,
    scheduledAt?: Date
  ): EmailCampaign {
    const campaign: EmailCampaign = {
      id: uuidv4(),
      name,
      subject,
      template,
      recipients,
      personalization: personalization || {},
      scheduledAt,
      status: scheduledAt ? CampaignStatus.SCHEDULED : CampaignStatus.DRAFT,
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
      },
    };

    this.emailCampaigns.set(campaign.id, campaign);
    return campaign;
  }

  /**
   * Send email campaign
   */
  sendEmailCampaign(campaignId: string): EmailCampaign | undefined {
    const campaign = this.emailCampaigns.get(campaignId);
    if (!campaign) {
      return undefined;
    }

    campaign.status = CampaignStatus.ACTIVE;
    campaign.sentAt = new Date();
    campaign.metrics.sent = campaign.recipients.length;
    campaign.metrics.delivered = Math.floor(campaign.recipients.length * 0.98); // 98% delivery rate
    campaign.metrics.opened = Math.floor(campaign.metrics.delivered * 0.25); // 25% open rate
    campaign.metrics.clicked = Math.floor(campaign.metrics.opened * 0.15); // 15% click rate
    campaign.metrics.converted = Math.floor(campaign.metrics.clicked * 0.1); // 10% conversion

    return campaign;
  }

  /**
   * Generate social media content
   */
  generateSocialContent(industry: Industry, platform: SocialMediaPost['platform']): SocialMediaPost {
    const contentTemplates: Record<string, string> = {
      LINKEDIN: `🚀 Exciting news for ${industry} companies!\n\nScrollSoul's enterprise platform now offers:\n✅ White-label deployment\n✅ Crypto employee incentives\n✅ 99.99% uptime SLA\n\nReady to transform your music operations? Let's talk! 💼\n\n#MusicTech #${industry} #Innovation`,
      
      TWITTER: `Introducing ScrollSoul for ${industry} 🎵\n\nStreamline music licensing, empower your team with crypto rewards, and scale effortlessly.\n\n🔥 Enterprise-ready\n⚡ Deploy in days\n💎 Rose gold encryption\n\nLearn more: scrollsoul.com\n\n#MusicPlatform #${industry}Tech`,
      
      FACEBOOK: `ScrollSoul is revolutionizing how ${industry} companies handle music!\n\n🎼 Pre-cleared licensing\n💰 Employee crypto incentives\n📊 Real-time analytics\n🚀 One-click deployment\n\nJoin Fortune 500 companies already using ScrollSoul.\n\nTap to learn more!`,
      
      INSTAGRAM: `${industry} meets innovation 🌟\n\nScrollSoul brings you:\n🎵 Seamless music licensing\n💎 Crypto rewards for teams\n⚡ Lightning-fast deployment\n\nSwipe up to transform your business! 🚀`,
    };

    const post: SocialMediaPost = {
      id: uuidv4(),
      platform,
      content: contentTemplates[platform] || contentTemplates.LINKEDIN,
      hashtags: ['ScrollSoul', `${industry}Tech`, 'MusicPlatform', 'Innovation'],
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      status: CampaignStatus.SCHEDULED,
      metrics: {
        impressions: 0,
        engagements: 0,
        clicks: 0,
        shares: 0,
      },
    };

    this.socialPosts.set(post.id, post);
    return post;
  }

  /**
   * Schedule webinar
   */
  scheduleWebinar(
    title: string,
    description: string,
    presenters: string[],
    scheduledAt: Date,
    duration: number = 60,
    attendeeLimit?: number
  ): Webinar {
    const webinar: Webinar = {
      id: uuidv4(),
      title,
      description,
      presenters,
      scheduledAt,
      duration,
      registrationUrl: `https://webinars.scrollsoul.com/register/${uuidv4()}`,
      attendeeLimit,
      registrations: 0,
      attendees: 0,
      status: 'SCHEDULED',
    };

    this.webinars.set(webinar.id, webinar);
    return webinar;
  }

  /**
   * Generate sales deck
   */
  generateSalesDeck(name: string, industry?: Industry): SalesDeck {
    const slides = [
      {
        title: 'ScrollSoul Enterprise Platform',
        content: 'The world\'s first turnkey music sync platform with built-in cryptocurrency employee incentives',
        layout: 'TITLE' as const,
      },
      {
        title: 'The Problem',
        content: `For ${industry || 'businesses'}:\n• Complex music licensing\n• Employee engagement challenges\n• Technical integration burden\n• Compliance concerns`,
        layout: 'CONTENT' as const,
      },
      {
        title: 'Our Solution',
        content: 'All-in-one platform with:\n• Pre-cleared music licensing\n• Crypto employee rewards\n• White-label deployment\n• Enterprise security',
        layout: 'TWO_COLUMN' as const,
      },
      {
        title: 'Revenue Model',
        content: 'Flexible pricing:\n• SaaS subscription\n• Revenue share\n• Usage-based\n• Hybrid options',
        layout: 'CONTENT' as const,
      },
      {
        title: 'ROI & Results',
        content: 'Typical customer results:\n• 80% reduction in licensing time\n• 15% increase in employee engagement\n• 300-600% ROI in Year 1',
        layout: 'CHART' as const,
      },
      {
        title: 'Next Steps',
        content: '1. Schedule demo\n2. Custom ROI analysis\n3. Pilot program\n4. Full deployment',
        layout: 'CONTENT' as const,
      },
    ];

    const deck: SalesDeck = {
      id: uuidv4(),
      name,
      industry,
      slides,
      downloadUrl: `https://decks.scrollsoul.com/${uuidv4()}.pdf`,
      createdAt: new Date(),
    };

    this.salesDecks.set(deck.id, deck);
    return deck;
  }

  /**
   * Create lead
   */
  createLead(
    companyName: string,
    contactName: string,
    contactEmail: string,
    source: string,
    industry?: Industry,
    contactPhone?: string
  ): Lead {
    const lead: Lead = {
      id: uuidv4(),
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      industry,
      source,
      status: LeadStatus.NEW,
      score: this.calculateLeadScore(industry, source),
      notes: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.leads.set(lead.id, lead);
    return lead;
  }

  /**
   * Calculate lead score
   */
  private calculateLeadScore(industry?: Industry, source?: string): number {
    let score = 50; // Base score

    // Industry scoring
    if (industry === Industry.ENTERTAINMENT || industry === Industry.TECHNOLOGY) {
      score += 20;
    }

    // Source scoring
    if (source === 'referral') score += 30;
    else if (source === 'demo request') score += 25;
    else if (source === 'webinar') score += 20;
    else if (source === 'website') score += 10;

    return Math.min(100, score);
  }

  /**
   * Update lead status
   */
  updateLeadStatus(leadId: string, status: LeadStatus, note?: string): Lead | undefined {
    const lead = this.leads.get(leadId);
    if (lead) {
      lead.status = status;
      lead.lastActivity = new Date();
      if (note) {
        lead.notes.push(`${new Date().toISOString()}: ${note}`);
      }
    }
    return lead;
  }

  /**
   * Get leads by status
   */
  getLeadsByStatus(status: LeadStatus): Lead[] {
    return Array.from(this.leads.values()).filter((l) => l.status === status);
  }

  /**
   * Get high-value leads
   */
  getHighValueLeads(minScore: number = 70): Lead[] {
    return Array.from(this.leads.values())
      .filter((l) => l.score >= minScore)
      .sort((a, b) => b.score - a.score);
  }

  /**
   * Publish landing page
   */
  publishLandingPage(pageId: string): LandingPage | undefined {
    const page = this.landingPages.get(pageId);
    if (page) {
      page.published = true;
    }
    return page;
  }

  /**
   * Get statistics
   */
  getStats() {
    const campaigns = Array.from(this.emailCampaigns.values());
    const leads = Array.from(this.leads.values());

    return {
      totalLandingPages: this.landingPages.size,
      publishedPages: Array.from(this.landingPages.values()).filter((p) => p.published).length,
      totalEmailCampaigns: campaigns.length,
      activeEmailCampaigns: campaigns.filter((c) => c.status === CampaignStatus.ACTIVE).length,
      totalSocialPosts: this.socialPosts.size,
      totalWebinars: this.webinars.size,
      totalSalesDecks: this.salesDecks.size,
      totalLeads: leads.length,
      qualifiedLeads: leads.filter((l) => l.status === LeadStatus.QUALIFIED).length,
      closedWonLeads: leads.filter((l) => l.status === LeadStatus.CLOSED_WON).length,
      averageLeadScore: leads.reduce((sum, l) => sum + l.score, 0) / Math.max(leads.length, 1),
    };
  }
}
