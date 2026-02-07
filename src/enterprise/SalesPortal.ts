import { v4 as uuidv4 } from 'uuid';

/**
 * Pricing tiers for enterprise customers
 */
export enum PricingTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
  ENTERPRISE_PLUS = 'ENTERPRISE_PLUS',
}

/**
 * Company size categories
 */
export enum CompanySize {
  SMALL = 'SMALL', // 1-100 employees
  MEDIUM = 'MEDIUM', // 101-1000 employees
  LARGE = 'LARGE', // 1001-10000 employees
  ENTERPRISE = 'ENTERPRISE', // 10000+ employees
}

/**
 * Integration effort levels
 */
export enum IntegrationEffort {
  MINIMAL = 'MINIMAL', // < 1 week
  LOW = 'LOW', // 1-2 weeks
  MEDIUM = 'MEDIUM', // 2-4 weeks
  HIGH = 'HIGH', // 1-2 months
  COMPLEX = 'COMPLEX', // 2+ months
}

/**
 * Company onboarding data
 */
export interface CompanyOnboarding {
  id: string;
  companyName: string;
  industry: string;
  companySize: CompanySize;
  employeeCount: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  interestedTier: PricingTier;
  useCase: string;
  estimatedMonthlyUsers: number;
  requiredIntegrations: string[];
  createdAt: Date;
  status: 'PENDING' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATING' | 'CLOSED_WON' | 'CLOSED_LOST';
}

/**
 * Pricing tier configuration
 */
export interface PricingTierConfig {
  tier: PricingTier;
  name: string;
  priceRangeMin: number;
  priceRangeMax: number;
  maxEmployees: number | null;
  features: string[];
  sla: string;
  support: string;
  cryptoIncentives: boolean;
  customTokenCreation: boolean;
  whiteLabel: boolean;
  dedicatedManager: boolean;
}

/**
 * ROI calculation result
 */
export interface ROICalculation {
  investmentAmount: number;
  employeeEngagementIncrease: number; // percentage
  productivityGainPerEmployee: number; // dollars/year
  retentionImprovement: number; // percentage
  talentAcquisitionCostSavings: number; // dollars/year
  totalAnnualBenefit: number;
  roi: number; // percentage
  paybackPeriod: number; // months
}

/**
 * Quote generation data
 */
export interface Quote {
  id: string;
  companyId: string;
  tier: PricingTier;
  employeeCount: number;
  monthlyPrice: number;
  annualPrice: number;
  setupFee: number;
  customizations: string[];
  customizationCost: number;
  totalFirstYearCost: number;
  discountPercentage: number;
  validUntil: Date;
  createdAt: Date;
  createdBy: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
}

/**
 * Contract details
 */
export interface Contract {
  id: string;
  quoteId: string;
  companyId: string;
  tier: PricingTier;
  startDate: Date;
  endDate: Date;
  monthlyRecurring: number;
  billingCycle: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  paymentTerms: string;
  autoRenewal: boolean;
  signedAt?: Date;
  signedBy?: string;
  status: 'DRAFT' | 'PENDING_SIGNATURE' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'EXPIRED';
}

/**
 * Enterprise Sales Portal
 * Manages B2B sales, onboarding, pricing, and contracts
 */
export class SalesPortal {
  private companies: Map<string, CompanyOnboarding> = new Map();
  private quotes: Map<string, Quote> = new Map();
  private contracts: Map<string, Contract> = new Map();

  private readonly pricingTiers: Map<PricingTier, PricingTierConfig> = new Map([
    [
      PricingTier.STARTER,
      {
        tier: PricingTier.STARTER,
        name: 'Starter',
        priceRangeMin: 2000,
        priceRangeMax: 10000,
        maxEmployees: 100,
        features: [
          'ScrollSoul-branded access',
          'Pre-built integrations',
          'Community support',
          'Basic crypto rewards',
          'Standard analytics',
        ],
        sla: '99%',
        support: 'Community',
        cryptoIncentives: true,
        customTokenCreation: false,
        whiteLabel: false,
        dedicatedManager: false,
      },
    ],
    [
      PricingTier.PROFESSIONAL,
      {
        tier: PricingTier.PROFESSIONAL,
        name: 'Professional',
        priceRangeMin: 10000,
        priceRangeMax: 50000,
        maxEmployees: 1000,
        features: [
          'Semi-branded platform',
          'Standard integrations',
          'Email support',
          'Crypto rewards (ScrollSoul tokens)',
          'Advanced analytics',
          'Custom reporting',
        ],
        sla: '99.9%',
        support: 'Email',
        cryptoIncentives: true,
        customTokenCreation: false,
        whiteLabel: false,
        dedicatedManager: false,
      },
    ],
    [
      PricingTier.ENTERPRISE,
      {
        tier: PricingTier.ENTERPRISE,
        name: 'Enterprise',
        priceRangeMin: 50000,
        priceRangeMax: 250000,
        maxEmployees: null,
        features: [
          'Full white-label platform',
          'Custom integrations',
          'Dedicated success manager',
          'Crypto incentive platform included',
          'Real-time analytics',
          'Custom dashboards',
          'API access',
        ],
        sla: '99.99%',
        support: 'Dedicated Manager',
        cryptoIncentives: true,
        customTokenCreation: true,
        whiteLabel: true,
        dedicatedManager: true,
      },
    ],
    [
      PricingTier.ENTERPRISE_PLUS,
      {
        tier: PricingTier.ENTERPRISE_PLUS,
        name: 'Enterprise Plus',
        priceRangeMin: 250000,
        priceRangeMax: 500000,
        maxEmployees: null,
        features: [
          'Everything in Enterprise',
          'Custom token creation & management',
          'White-glove integration service',
          'Branded mobile apps (iOS/Android)',
          'Multi-region deployment',
          'Advanced compliance tools',
          'Custom AI training',
        ],
        sla: '99.999%',
        support: 'White Glove',
        cryptoIncentives: true,
        customTokenCreation: true,
        whiteLabel: true,
        dedicatedManager: true,
      },
    ],
  ]);

  /**
   * Create a new company onboarding record
   */
  createCompanyOnboarding(data: Omit<CompanyOnboarding, 'id' | 'createdAt' | 'status'>): CompanyOnboarding {
    const company: CompanyOnboarding = {
      ...data,
      id: uuidv4(),
      createdAt: new Date(),
      status: 'PENDING',
    };

    this.companies.set(company.id, company);
    return company;
  }

  /**
   * Get company by ID
   */
  getCompany(companyId: string): CompanyOnboarding | undefined {
    return this.companies.get(companyId);
  }

  /**
   * Update company status
   */
  updateCompanyStatus(
    companyId: string,
    status: CompanyOnboarding['status']
  ): CompanyOnboarding | undefined {
    const company = this.companies.get(companyId);
    if (company) {
      company.status = status;
    }
    return company;
  }

  /**
   * Get all companies
   */
  getAllCompanies(): CompanyOnboarding[] {
    return Array.from(this.companies.values());
  }

  /**
   * Get companies by status
   */
  getCompaniesByStatus(status: CompanyOnboarding['status']): CompanyOnboarding[] {
    return Array.from(this.companies.values()).filter((c) => c.status === status);
  }

  /**
   * Calculate pricing for a specific tier and employee count
   */
  calculatePricing(tier: PricingTier, employeeCount: number): {
    monthlyPrice: number;
    annualPrice: number;
    pricePerEmployee: number;
  } {
    const config = this.pricingTiers.get(tier);
    if (!config) {
      throw new Error(`Invalid pricing tier: ${tier}`);
    }

    // Calculate base price based on employee count and tier
    let monthlyPrice: number;

    if (tier === PricingTier.STARTER) {
      monthlyPrice = Math.min(
        config.priceRangeMax,
        Math.max(config.priceRangeMin, employeeCount * 50)
      );
    } else if (tier === PricingTier.PROFESSIONAL) {
      monthlyPrice = Math.min(
        config.priceRangeMax,
        Math.max(config.priceRangeMin, employeeCount * 35)
      );
    } else if (tier === PricingTier.ENTERPRISE) {
      monthlyPrice = Math.min(
        config.priceRangeMax,
        Math.max(config.priceRangeMin, employeeCount * 25)
      );
    } else {
      // ENTERPRISE_PLUS
      monthlyPrice = Math.min(
        config.priceRangeMax,
        Math.max(config.priceRangeMin, employeeCount * 20)
      );
    }

    const annualPrice = monthlyPrice * 12 * 0.9; // 10% discount for annual
    const pricePerEmployee = monthlyPrice / employeeCount;

    return {
      monthlyPrice,
      annualPrice,
      pricePerEmployee,
    };
  }

  /**
   * Calculate ROI for a company
   */
  calculateROI(employeeCount: number, averageSalary: number, tier: PricingTier): ROICalculation {
    const pricing = this.calculatePricing(tier, employeeCount);
    const investmentAmount = pricing.annualPrice;

    // Conservative estimates based on industry research
    const employeeEngagementIncrease = tier === PricingTier.STARTER ? 5 : tier === PricingTier.PROFESSIONAL ? 10 : 15; // percentage
    const productivityGainPerEmployee = averageSalary * (employeeEngagementIncrease / 100) * 0.2; // 20% of engagement increase
    const retentionImprovement = tier === PricingTier.STARTER ? 3 : tier === PricingTier.PROFESSIONAL ? 5 : 8; // percentage
    const replacementCost = averageSalary * 0.5; // 50% of salary to replace an employee
    const talentAcquisitionCostSavings = (employeeCount * (retentionImprovement / 100) * replacementCost);

    const totalAnnualBenefit =
      productivityGainPerEmployee * employeeCount + talentAcquisitionCostSavings;

    const roi = ((totalAnnualBenefit - investmentAmount) / investmentAmount) * 100;
    const paybackPeriod = (investmentAmount / (totalAnnualBenefit / 12));

    return {
      investmentAmount,
      employeeEngagementIncrease,
      productivityGainPerEmployee,
      retentionImprovement,
      talentAcquisitionCostSavings,
      totalAnnualBenefit,
      roi,
      paybackPeriod,
    };
  }

  /**
   * Estimate integration effort
   */
  estimateIntegrationEffort(requiredIntegrations: string[], companySize: CompanySize): {
    effort: IntegrationEffort;
    estimatedWeeks: number;
    estimatedCost: number;
  } {
    const baseWeeks = requiredIntegrations.length * 0.5;
    const sizeMultiplier = companySize === CompanySize.SMALL ? 1 : companySize === CompanySize.MEDIUM ? 1.5 : companySize === CompanySize.LARGE ? 2 : 2.5;

    const estimatedWeeks = baseWeeks * sizeMultiplier;
    const estimatedCost = estimatedWeeks * 10000; // $10k per week

    let effort: IntegrationEffort;
    if (estimatedWeeks < 1) effort = IntegrationEffort.MINIMAL;
    else if (estimatedWeeks < 2) effort = IntegrationEffort.LOW;
    else if (estimatedWeeks < 4) effort = IntegrationEffort.MEDIUM;
    else if (estimatedWeeks < 8) effort = IntegrationEffort.HIGH;
    else effort = IntegrationEffort.COMPLEX;

    return { effort, estimatedWeeks, estimatedCost };
  }

  /**
   * Generate a quote for a company
   */
  generateQuote(
    companyId: string,
    tier: PricingTier,
    customizations: string[] = [],
    discountPercentage: number = 0,
    createdBy: string = 'System'
  ): Quote {
    const company = this.companies.get(companyId);
    if (!company) {
      throw new Error(`Company not found: ${companyId}`);
    }

    const pricing = this.calculatePricing(tier, company.employeeCount);
    const integrationEstimate = this.estimateIntegrationEffort(
      company.requiredIntegrations,
      company.companySize
    );

    const customizationCost = customizations.length * 5000; // $5k per customization
    const setupFee = integrationEstimate.estimatedCost;

    const monthlyPrice = pricing.monthlyPrice * (1 - discountPercentage / 100);
    const annualPrice = pricing.annualPrice * (1 - discountPercentage / 100);
    const totalFirstYearCost = annualPrice + setupFee + customizationCost;

    const quote: Quote = {
      id: uuidv4(),
      companyId,
      tier,
      employeeCount: company.employeeCount,
      monthlyPrice,
      annualPrice,
      setupFee,
      customizations,
      customizationCost,
      totalFirstYearCost,
      discountPercentage,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      createdBy,
      status: 'DRAFT',
    };

    this.quotes.set(quote.id, quote);
    return quote;
  }

  /**
   * Get quote by ID
   */
  getQuote(quoteId: string): Quote | undefined {
    return this.quotes.get(quoteId);
  }

  /**
   * Update quote status
   */
  updateQuoteStatus(quoteId: string, status: Quote['status']): Quote | undefined {
    const quote = this.quotes.get(quoteId);
    if (quote) {
      quote.status = status;
    }
    return quote;
  }

  /**
   * Get all quotes for a company
   */
  getQuotesByCompany(companyId: string): Quote[] {
    return Array.from(this.quotes.values()).filter((q) => q.companyId === companyId);
  }

  /**
   * Create a contract from an accepted quote
   */
  createContract(
    quoteId: string,
    billingCycle: Contract['billingCycle'] = 'ANNUAL',
    autoRenewal: boolean = true
  ): Contract {
    const quote = this.quotes.get(quoteId);
    if (!quote) {
      throw new Error(`Quote not found: ${quoteId}`);
    }

    if (quote.status !== 'ACCEPTED') {
      throw new Error(`Quote must be accepted before creating contract`);
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year contract

    let monthlyRecurring: number;
    if (billingCycle === 'MONTHLY') {
      monthlyRecurring = quote.monthlyPrice;
    } else if (billingCycle === 'QUARTERLY') {
      monthlyRecurring = quote.annualPrice / 4;
    } else {
      monthlyRecurring = quote.annualPrice;
    }

    const contract: Contract = {
      id: uuidv4(),
      quoteId,
      companyId: quote.companyId,
      tier: quote.tier,
      startDate,
      endDate,
      monthlyRecurring,
      billingCycle,
      paymentTerms: 'Net 30',
      autoRenewal,
      status: 'PENDING_SIGNATURE',
    };

    this.contracts.set(contract.id, contract);
    return contract;
  }

  /**
   * Sign a contract
   */
  signContract(contractId: string, signedBy: string): Contract | undefined {
    const contract = this.contracts.get(contractId);
    if (contract) {
      contract.status = 'ACTIVE';
      contract.signedAt = new Date();
      contract.signedBy = signedBy;
    }
    return contract;
  }

  /**
   * Get contract by ID
   */
  getContract(contractId: string): Contract | undefined {
    return this.contracts.get(contractId);
  }

  /**
   * Get all contracts for a company
   */
  getContractsByCompany(companyId: string): Contract[] {
    return Array.from(this.contracts.values()).filter((c) => c.companyId === companyId);
  }

  /**
   * Get active contracts
   */
  getActiveContracts(): Contract[] {
    return Array.from(this.contracts.values()).filter((c) => c.status === 'ACTIVE');
  }

  /**
   * Get pricing tier configuration
   */
  getPricingTierConfig(tier: PricingTier): PricingTierConfig | undefined {
    return this.pricingTiers.get(tier);
  }

  /**
   * Get all pricing tiers
   */
  getAllPricingTiers(): PricingTierConfig[] {
    return Array.from(this.pricingTiers.values());
  }

  /**
   * Get sales statistics
   */
  getStats() {
    const companies = Array.from(this.companies.values());
    const quotes = Array.from(this.quotes.values());
    const contracts = Array.from(this.contracts.values());

    return {
      totalCompanies: companies.length,
      pendingCompanies: companies.filter((c) => c.status === 'PENDING').length,
      qualifiedCompanies: companies.filter((c) => c.status === 'QUALIFIED').length,
      totalQuotes: quotes.length,
      acceptedQuotes: quotes.filter((q) => q.status === 'ACCEPTED').length,
      totalContracts: contracts.length,
      activeContracts: contracts.filter((c) => c.status === 'ACTIVE').length,
      totalARR: contracts
        .filter((c) => c.status === 'ACTIVE')
        .reduce((sum, c) => sum + c.monthlyRecurring * 12, 0),
    };
  }
}
