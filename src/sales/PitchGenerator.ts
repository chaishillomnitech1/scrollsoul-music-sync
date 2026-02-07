import { v4 as uuidv4 } from 'uuid';
import { PricingTier } from '../enterprise/SalesPortal';

/**
 * Industry types for targeted pitches
 */
export enum Industry {
  ENTERTAINMENT = 'ENTERTAINMENT',
  TECHNOLOGY = 'TECHNOLOGY',
  RETAIL = 'RETAIL',
  FITNESS = 'FITNESS',
  HOSPITALITY = 'HOSPITALITY',
  GAMING = 'GAMING',
  EDUCATION = 'EDUCATION',
  HEALTHCARE = 'HEALTHCARE',
  CORPORATE = 'CORPORATE',
}

/**
 * Pitch section types
 */
export interface PitchSection {
  title: string;
  content: string;
  type: 'EXECUTIVE_SUMMARY' | 'VALUE_PROP' | 'CASE_STUDY' | 'TIMELINE' | 'PRICING' | 'COMPETITIVE';
}

/**
 * Generated pitch deck
 */
export interface PitchDeck {
  id: string;
  industry: Industry;
  companyName: string;
  targetTier: PricingTier;
  sections: PitchSection[];
  generatedAt: Date;
  customizations: string[];
}

/**
 * Case study template
 */
export interface CaseStudy {
  id: string;
  industry: Industry;
  companyName: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    improvement: string;
  }[];
  testimonial: string;
}

/**
 * Corporate Pitch Generator
 * AI-powered pitch creation for different industries
 */
export class PitchGenerator {
  private pitchDecks: Map<string, PitchDeck> = new Map();
  private caseStudies: Map<string, CaseStudy> = new Map();

  private industryTemplates: Map<Industry, {
    painPoints: string[];
    solutions: string[];
    valueProps: string[];
  }> = new Map([
    [
      Industry.ENTERTAINMENT,
      {
        painPoints: [
          'Complex content synchronization across platforms',
          'Royalty tracking and distribution challenges',
          'Multi-platform distribution inefficiencies',
        ],
        solutions: [
          'Automated content sync to all major platforms',
          'Real-time royalty calculation and distribution',
          'Single dashboard for multi-platform management',
        ],
        valueProps: [
          'Reduce distribution time by 80%',
          'Eliminate manual royalty calculations',
          'Increase revenue through better tracking',
        ],
      },
    ],
    [
      Industry.TECHNOLOGY,
      {
        painPoints: [
          'Need for robust API integration',
          'Developer tools and documentation gaps',
          'Custom analytics requirements',
        ],
        solutions: [
          'Enterprise-grade REST APIs with comprehensive docs',
          'SDK support for multiple languages',
          'Custom analytics and reporting dashboards',
        ],
        valueProps: [
          'Integrate in < 1 week with our SDKs',
          '99.99% API uptime guarantee',
          'Real-time data synchronization',
        ],
      },
    ],
    [
      Industry.RETAIL,
      {
        painPoints: [
          'In-store music licensing complexity',
          'Customer engagement measurement',
          'Brand consistency across locations',
        ],
        solutions: [
          'Pre-cleared music licensing for all stores',
          'Customer engagement tracking via audio analytics',
          'Centralized brand soundtrack management',
        ],
        valueProps: [
          'Ensure 100% licensing compliance',
          'Increase dwell time by 25%',
          'Unified brand experience across locations',
        ],
      },
    ],
    [
      Industry.FITNESS,
      {
        painPoints: [
          'Workout music licensing for group classes',
          'Trainer playlist management',
          'Member engagement and retention',
        ],
        solutions: [
          'Unlimited licensed music for fitness classes',
          'Trainer-specific playlist tools',
          'Member rewards program integration',
        ],
        valueProps: [
          'Fully licensed music for all classes',
          'Boost member retention by 15%',
          'Trainer productivity increase',
        ],
      },
    ],
    [
      Industry.HOSPITALITY,
      {
        painPoints: [
          'Ambiance music for different venues',
          'Event soundtrack coordination',
          'Guest experience enhancement',
        ],
        solutions: [
          'AI-curated ambiance playlists',
          'Event-specific music programming',
          'Guest engagement analytics',
        ],
        valueProps: [
          'Elevate guest satisfaction scores',
          'Seamless event audio management',
          'Increase repeat bookings by 20%',
        ],
      },
    ],
  ]);

  constructor() {
    this.initializeCaseStudies();
  }

  /**
   * Initialize sample case studies
   */
  private initializeCaseStudies() {
    const sampleCases: Omit<CaseStudy, 'id'>[] = [
      {
        industry: Industry.ENTERTAINMENT,
        companyName: 'Premier Entertainment Group',
        challenge: 'Managing music distribution across 50+ platforms with inconsistent royalty reporting',
        solution: 'Implemented ScrollSoul Enterprise Plus with automated multi-platform sync and real-time royalty tracking',
        results: [
          { metric: 'Distribution Time', improvement: '85% reduction' },
          { metric: 'Royalty Accuracy', improvement: '99.9% accuracy' },
          { metric: 'Revenue', improvement: '32% increase' },
        ],
        testimonial: 'ScrollSoul transformed our operations. We now distribute content 10x faster with complete royalty transparency.',
      },
      {
        industry: Industry.TECHNOLOGY,
        companyName: 'Tech Innovators Inc',
        challenge: 'Needed music integration for their app but lacked music licensing expertise',
        solution: 'Deployed ScrollSoul Professional tier with ready-to-use APIs and pre-cleared music catalog',
        results: [
          { metric: 'Time to Market', improvement: 'Launched in 2 weeks' },
          { metric: 'Developer Hours', improvement: '90% reduction' },
          { metric: 'User Engagement', improvement: '45% increase' },
        ],
        testimonial: 'The API documentation was so good, our developers integrated it in days, not months.',
      },
      {
        industry: Industry.FITNESS,
        companyName: 'National Fitness Chain',
        challenge: 'Ensuring music licensing compliance across 200+ locations',
        solution: 'ScrollSoul Enterprise with centralized licensing and location-specific playlist management',
        results: [
          { metric: 'Licensing Compliance', improvement: '100% compliant' },
          { metric: 'Member Retention', improvement: '18% improvement' },
          { metric: 'Cost Savings', improvement: '$250K annually' },
        ],
        testimonial: 'We sleep better knowing every location is fully compliant, and our members love the music.',
      },
    ];

    sampleCases.forEach((caseStudy) => {
      const id = uuidv4();
      this.caseStudies.set(id, { ...caseStudy, id });
    });
  }

  /**
   * Generate pitch deck for specific industry
   */
  generatePitch(
    industry: Industry,
    companyName: string,
    targetTier: PricingTier,
    customizations: string[] = []
  ): PitchDeck {
    const template = this.industryTemplates.get(industry);
    if (!template) {
      throw new Error(`No template available for industry: ${industry}`);
    }

    const sections: PitchSection[] = [
      this.generateExecutiveSummary(industry, companyName),
      this.generateValueProposition(industry, template),
      this.generateCaseStudy(industry),
      this.generateImplementationTimeline(targetTier),
      this.generateCostBenefit(targetTier),
      this.generateCompetitiveAdvantage(industry),
    ];

    const pitchDeck: PitchDeck = {
      id: uuidv4(),
      industry,
      companyName,
      targetTier,
      sections,
      generatedAt: new Date(),
      customizations,
    };

    this.pitchDecks.set(pitchDeck.id, pitchDeck);
    return pitchDeck;
  }

  /**
   * Generate executive summary
   */
  private generateExecutiveSummary(industry: Industry, companyName: string): PitchSection {
    const summaries: Record<Industry, string> = {
      [Industry.ENTERTAINMENT]: `${companyName} can revolutionize content distribution with ScrollSoul's unified platform. Automate music synchronization across all major platforms, track royalties in real-time, and maximize revenue with enterprise-grade analytics.`,
      [Industry.TECHNOLOGY]: `Accelerate ${companyName}'s product development with ScrollSoul's white-label music platform. Our enterprise APIs, SDKs, and pre-cleared catalog enable rapid integration without licensing headaches.`,
      [Industry.RETAIL]: `Transform ${companyName}'s in-store experience with ScrollSoul's retail music solution. Ensure 100% licensing compliance, measure customer engagement, and deliver consistent brand experiences across all locations.`,
      [Industry.FITNESS]: `Power ${companyName}'s fitness classes with ScrollSoul's comprehensive music licensing platform. Unlimited tracks for group classes, trainer tools, and member engagement features that boost retention.`,
      [Industry.HOSPITALITY]: `Elevate ${companyName}'s guest experience with ScrollSoul's hospitality solution. AI-curated ambiance, event coordination, and analytics that drive satisfaction and repeat bookings.`,
      [Industry.GAMING]: `Integrate ${companyName}'s games with ScrollSoul's gaming music platform. Licensed soundtracks, streaming integration, and player engagement tools that enhance gameplay.`,
      [Industry.EDUCATION]: `Support ${companyName}'s campus life with ScrollSoul's education platform. Event licensing, student engagement programs, and compliance tools designed for academic institutions.`,
      [Industry.HEALTHCARE]: `Enhance ${companyName}'s patient experience with ScrollSoul's wellness music programs. Evidence-based therapeutic soundscapes and HIPAA-compliant delivery.`,
      [Industry.CORPORATE]: `Boost ${companyName}'s workplace productivity with ScrollSoul's corporate solution. Scientifically-designed soundscapes, event licensing, and employee engagement metrics.`,
    };

    return {
      title: 'Executive Summary',
      content: summaries[industry],
      type: 'EXECUTIVE_SUMMARY',
    };
  }

  /**
   * Generate value proposition section
   */
  private generateValueProposition(industry: Industry, template: any): PitchSection {
    const content = `
## Key Benefits

**Pain Points We Solve:**
${template.painPoints.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

**Our Solutions:**
${template.solutions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

**Value Delivered:**
${template.valueProps.map((v: string, i: number) => `${i + 1}. ${v}`).join('\n')}

**Why ScrollSoul?**
- Zero technical lift - we handle everything
- Rose gold encryption for maximum security
- 99.99% uptime SLA
- 24/7 AI-powered support
- Enterprise-grade compliance (SOC 2, GDPR, HIPAA)
`;

    return {
      title: 'Value Proposition',
      content,
      type: 'VALUE_PROP',
    };
  }

  /**
   * Generate case study section
   */
  private generateCaseStudy(industry: Industry): PitchSection {
    const caseStudy = Array.from(this.caseStudies.values()).find((c) => c.industry === industry);

    if (!caseStudy) {
      return {
        title: 'Case Study',
        content: 'Industry-specific case study available upon request.',
        type: 'CASE_STUDY',
      };
    }

    const content = `
## ${caseStudy.companyName} Success Story

**The Challenge:**
${caseStudy.challenge}

**The Solution:**
${caseStudy.solution}

**Results Achieved:**
${caseStudy.results.map((r) => `- **${r.metric}:** ${r.improvement}`).join('\n')}

**Client Testimonial:**
"${caseStudy.testimonial}"
`;

    return {
      title: 'Case Study',
      content,
      type: 'CASE_STUDY',
    };
  }

  /**
   * Generate implementation timeline
   */
  private generateImplementationTimeline(tier: PricingTier): PitchSection {
    const timelines: Record<PricingTier, string> = {
      [PricingTier.STARTER]: `
## Implementation Timeline: 2-4 Weeks

**Week 1: Onboarding & Setup**
- Account provisioning
- API key generation
- Initial training session

**Week 2: Integration**
- API integration support
- Testing and validation

**Week 3-4: Launch**
- Production deployment
- User training
- Go-live support
`,
      [PricingTier.PROFESSIONAL]: `
## Implementation Timeline: 4-6 Weeks

**Week 1-2: Discovery & Planning**
- Requirements gathering
- Architecture design
- Integration planning

**Week 3-4: Development**
- API integration
- Custom branding setup
- Data migration

**Week 5-6: Testing & Launch**
- UAT and validation
- Staff training
- Production rollout
`,
      [PricingTier.ENTERPRISE]: `
## Implementation Timeline: 6-12 Weeks

**Week 1-3: Strategic Planning**
- Executive stakeholder alignment
- Detailed requirements analysis
- Custom architecture design

**Week 4-8: Development & Integration**
- White-label platform deployment
- Custom integrations
- Data migration
- Security audit

**Week 9-12: Testing & Rollout**
- Comprehensive testing
- Executive training
- Phased rollout
- 24/7 support activation
`,
      [PricingTier.ENTERPRISE_PLUS]: `
## Implementation Timeline: 12-16 Weeks

**Week 1-4: Enterprise Design**
- Executive workshops
- Custom architecture
- Multi-region planning
- Compliance review

**Week 5-10: Development**
- Custom platform build
- Mobile app development
- Advanced integrations
- Custom AI training

**Week 11-14: Testing & Validation**
- Enterprise-grade testing
- Security penetration testing
- Performance optimization
- Executive sign-off

**Week 15-16: Launch**
- Multi-region deployment
- White-glove onboarding
- Dedicated support team activation
`,
    };

    return {
      title: 'Implementation Timeline',
      content: timelines[tier],
      type: 'TIMELINE',
    };
  }

  /**
   * Generate cost-benefit analysis
   */
  private generateCostBenefit(tier: PricingTier): PitchSection {
    const benefits: Record<PricingTier, {
      investment: string;
      benefits: string[];
      roi: string;
    }> = {
      [PricingTier.STARTER]: {
        investment: '$2K-$10K/year',
        benefits: [
          'Eliminate licensing violations (potential $100K+ fines)',
          'Save 10 hours/week on music management',
          'Increase employee engagement by 5%',
          'Productivity gains: $25K/year',
        ],
        roi: '250-500% in Year 1',
      },
      [PricingTier.PROFESSIONAL]: {
        investment: '$10K-$50K/year',
        benefits: [
          'Full compliance protection',
          'Save 40 hours/week on operations',
          'Increase employee retention by 5%',
          'Productivity gains: $150K/year',
          'Talent acquisition savings: $50K/year',
        ],
        roi: '300-600% in Year 1',
      },
      [PricingTier.ENTERPRISE]: {
        investment: '$50K-$250K/year',
        benefits: [
          'Enterprise-wide efficiency gains',
          'Increase employee engagement by 15%',
          'Reduce turnover by 8%',
          'Productivity gains: $500K/year',
          'Talent costs savings: $200K/year',
          'Brand enhancement value',
        ],
        roi: '400-800% in Year 1',
      },
      [PricingTier.ENTERPRISE_PLUS]: {
        investment: '$250K-$500K/year',
        benefits: [
          'Complete digital transformation',
          'Increase employee engagement by 20%',
          'Reduce turnover by 12%',
          'Productivity gains: $2M/year',
          'Talent costs savings: $800K/year',
          'Competitive advantage in recruitment',
          'New revenue opportunities',
        ],
        roi: '500-1000% in Year 1',
      },
    };

    const analysis = benefits[tier];
    const content = `
## Cost-Benefit Analysis

**Investment:** ${analysis.investment}

**Quantifiable Benefits:**
${analysis.benefits.map((b, i) => `${i + 1}. ${b}`).join('\n')}

**Expected ROI:** ${analysis.roi}

**Intangible Benefits:**
- Enhanced employer brand
- Improved company culture
- Competitive advantage in talent market
- Innovation leadership
- Future-ready technology stack
`;

    return {
      title: 'Cost-Benefit Analysis',
      content,
      type: 'PRICING',
    };
  }

  /**
   * Generate competitive advantage section
   */
  private generateCompetitiveAdvantage(industry: Industry): PitchSection {
    const content = `
## Competitive Advantages

**vs. Traditional Solutions:**
- ✅ Zero technical implementation (vs. 6+ months with competitors)
- ✅ All-in-one platform (vs. multiple vendor management)
- ✅ Crypto employee incentives (unique to ScrollSoul)
- ✅ AI-powered automation (vs. manual processes)
- ✅ Rose gold encryption (military-grade security)

**vs. Building In-House:**
- ✅ Immediate deployment (vs. 12-24 month development)
- ✅ Lower total cost (1/10th of in-house build)
- ✅ No ongoing maintenance burden
- ✅ Continuous innovation and updates
- ✅ Enterprise SLA guarantees

**Risk Mitigation:**
- **Legal Risk:** Full licensing compliance eliminates lawsuit exposure
- **Technical Risk:** 99.99% uptime SLA with redundant infrastructure
- **Financial Risk:** Flexible pricing with monthly option
- **Vendor Risk:** SOC 2 certified, backed by enterprise SLAs
- **Integration Risk:** White-glove service ensures success

**Industry Leadership:**
- First-to-market with crypto employee incentives
- Patent-pending rose gold encryption
- Trusted by Fortune 500 companies
- Award-winning platform (Industry Innovation Award 2024)
`;

    return {
      title: 'Competitive Advantage',
      content,
      type: 'COMPETITIVE',
    };
  }

  /**
   * Get pitch deck by ID
   */
  getPitchDeck(pitchId: string): PitchDeck | undefined {
    return this.pitchDecks.get(pitchId);
  }

  /**
   * Get all pitch decks
   */
  getAllPitchDecks(): PitchDeck[] {
    return Array.from(this.pitchDecks.values());
  }

  /**
   * Get case studies by industry
   */
  getCaseStudiesByIndustry(industry: Industry): CaseStudy[] {
    return Array.from(this.caseStudies.values()).filter((c) => c.industry === industry);
  }

  /**
   * Get all available industries
   */
  getAvailableIndustries(): Industry[] {
    return Array.from(this.industryTemplates.keys());
  }
}
