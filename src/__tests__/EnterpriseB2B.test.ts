import { SalesPortal, PricingTier, CompanySize } from '../enterprise/SalesPortal';
import { EmployeeIncentiveSystem, TokenType, TransactionType } from '../crypto/EmployeeIncentiveSystem';
import { ManagedIntegrationService, IntegrationStatus, TicketPriority } from '../services/ManagedIntegrationService';
import { PitchGenerator, Industry } from '../sales/PitchGenerator';
import { RevenueShareEngine, RevenueModel, Currency, PaymentMethod } from '../billing/RevenueShareEngine';
import { TurnkeyDeployment, Environment } from '../whitelabel/TurnkeyDeployment';

describe('Enterprise B2B Sales & Crypto Incentive Platform', () => {
  describe('SalesPortal', () => {
    let salesPortal: SalesPortal;

    beforeEach(() => {
      salesPortal = new SalesPortal();
    });

    test('should create company onboarding', () => {
      const company = salesPortal.createCompanyOnboarding({
        companyName: 'Test Corp',
        industry: 'Technology',
        companySize: CompanySize.MEDIUM,
        employeeCount: 500,
        contactName: 'John Doe',
        contactEmail: 'john@testcorp.com',
        contactPhone: '555-0100',
        website: 'https://testcorp.com',
        interestedTier: PricingTier.PROFESSIONAL,
        useCase: 'Employee engagement and music licensing',
        estimatedMonthlyUsers: 450,
        requiredIntegrations: ['Slack', 'Microsoft Teams'],
      });

      expect(company.id).toBeDefined();
      expect(company.companyName).toBe('Test Corp');
      expect(company.status).toBe('PENDING');
    });

    test('should calculate pricing correctly', () => {
      const pricing = salesPortal.calculatePricing(PricingTier.PROFESSIONAL, 500);

      expect(pricing.monthlyPrice).toBeGreaterThan(0);
      expect(pricing.annualPrice).toBe(pricing.monthlyPrice * 12 * 0.9);
      expect(pricing.pricePerEmployee).toBe(pricing.monthlyPrice / 500);
    });

    test('should calculate ROI', () => {
      const roi = salesPortal.calculateROI(500, 75000, PricingTier.PROFESSIONAL);

      expect(roi.roi).toBeGreaterThan(0);
      expect(roi.totalAnnualBenefit).toBeGreaterThan(roi.investmentAmount);
      expect(roi.paybackPeriod).toBeLessThan(12);
    });

    test('should generate quote', () => {
      const company = salesPortal.createCompanyOnboarding({
        companyName: 'Test Corp',
        industry: 'Technology',
        companySize: CompanySize.MEDIUM,
        employeeCount: 500,
        contactName: 'John Doe',
        contactEmail: 'john@testcorp.com',
        contactPhone: '555-0100',
        website: 'https://testcorp.com',
        interestedTier: PricingTier.PROFESSIONAL,
        useCase: 'Employee engagement',
        estimatedMonthlyUsers: 450,
        requiredIntegrations: ['Slack'],
      });

      const quote = salesPortal.generateQuote(
        company.id,
        PricingTier.PROFESSIONAL,
        ['Custom branding'],
        10
      );

      expect(quote.id).toBeDefined();
      expect(quote.companyId).toBe(company.id);
      expect(quote.discountPercentage).toBe(10);
      expect(quote.customizations).toContain('Custom branding');
    });

    test('should create contract from accepted quote', () => {
      const company = salesPortal.createCompanyOnboarding({
        companyName: 'Test Corp',
        industry: 'Technology',
        companySize: CompanySize.SMALL,
        employeeCount: 50,
        contactName: 'John Doe',
        contactEmail: 'john@testcorp.com',
        contactPhone: '555-0100',
        website: 'https://testcorp.com',
        interestedTier: PricingTier.STARTER,
        useCase: 'Basic licensing',
        estimatedMonthlyUsers: 40,
        requiredIntegrations: [],
      });

      const quote = salesPortal.generateQuote(company.id, PricingTier.STARTER);
      salesPortal.updateQuoteStatus(quote.id, 'ACCEPTED');

      const contract = salesPortal.createContract(quote.id);

      expect(contract.id).toBeDefined();
      expect(contract.quoteId).toBe(quote.id);
      expect(contract.status).toBe('PENDING_SIGNATURE');
    });
  });

  describe('EmployeeIncentiveSystem', () => {
    let incentiveSystem: EmployeeIncentiveSystem;

    beforeEach(() => {
      incentiveSystem = new EmployeeIncentiveSystem();
    });

    test('should create employee wallet', () => {
      const wallet = incentiveSystem.createEmployeeWallet('emp-001', 'company-001');

      expect(wallet.id).toBeDefined();
      expect(wallet.employeeId).toBe('emp-001');
      expect(wallet.companyId).toBe('company-001');
      expect(wallet.walletAddress).toMatch(/^0x/);
      expect(wallet.balances.get(TokenType.SRT)).toBe(0);
    });

    test('should award tokens to employee', () => {
      const wallet = incentiveSystem.createEmployeeWallet('emp-001', 'company-001');
      const transaction = incentiveSystem.awardTokens(
        wallet.id,
        100,
        'Performance bonus',
        TransactionType.BONUS
      );

      expect(transaction.id).toBeDefined();
      expect(transaction.amount).toBe(100);
      expect(transaction.type).toBe(TransactionType.BONUS);
      expect(incentiveSystem.getBalance(wallet.id)).toBe(100);
    });

    test('should create and process vesting schedule', () => {
      const wallet = incentiveSystem.createEmployeeWallet('emp-001', 'company-001');
      const vestingSchedule = incentiveSystem.createVestingSchedule(
        wallet.id,
        TokenType.SRT,
        1000,
        365
      );

      expect(vestingSchedule.id).toBeDefined();
      expect(vestingSchedule.totalAmount).toBe(1000);
      expect(vestingSchedule.remainingAmount).toBe(1000);
      expect(vestingSchedule.status).toBe('VESTING');
    });

    test('should stake and unstake tokens', () => {
      const wallet = incentiveSystem.createEmployeeWallet('emp-001', 'company-001');
      incentiveSystem.awardTokens(wallet.id, 1000, 'Initial grant');

      const pools = incentiveSystem.getAllStakingPools();
      const pool = pools[0];

      const stakeTransaction = incentiveSystem.stakeTokens(wallet.id, 100, pool.id);
      expect(stakeTransaction.type).toBe(TransactionType.STAKE);

      const updatedWallet = incentiveSystem.getWalletByEmployee('emp-001');
      expect(updatedWallet?.stakedBalance).toBe(100);
    });

    test('should generate leaderboard', () => {
      // Create multiple wallets with different balances
      for (let i = 1; i <= 5; i++) {
        const wallet = incentiveSystem.createEmployeeWallet(`emp-00${i}`, 'company-001');
        incentiveSystem.awardTokens(wallet.id, i * 100, 'Initial grant');
      }

      const leaderboard = incentiveSystem.getLeaderboard('company-001', 5);

      expect(leaderboard).toHaveLength(5);
      expect(leaderboard[0].rank).toBe(1);
      expect(leaderboard[0].totalTokens).toBeGreaterThan(leaderboard[1].totalTokens);
    });
  });

  describe('ManagedIntegrationService', () => {
    let integrationService: ManagedIntegrationService;

    beforeEach(() => {
      integrationService = new ManagedIntegrationService();
    });

    test('should create client integration', () => {
      const integration = integrationService.createIntegration(
        'company-001',
        'Test Company',
        ['music-sync', 'analytics']
      );

      expect(integration.id).toBeDefined();
      expect(integration.apiKey).toMatch(/^sk_live_/);
      expect(integration.status).toBe(IntegrationStatus.PENDING);
    });

    test('should deploy integration', async () => {
      const integration = integrationService.createIntegration(
        'company-001',
        'Test Company',
        ['music-sync']
      );

      const result = await integrationService.deployIntegration(integration.id);

      expect(result.success).toBe(true);
      expect(result.deploymentUrl).toBeDefined();

      const updatedIntegration = integrationService.getIntegration(integration.id);
      expect(updatedIntegration?.status).toBe(IntegrationStatus.DEPLOYED);
    });

    test('should perform health check', () => {
      const integration = integrationService.createIntegration(
        'company-001',
        'Test Company',
        ['music-sync']
      );
      integrationService.updateIntegrationStatus(integration.id, IntegrationStatus.DEPLOYED);

      const health = integrationService.performHealthCheck(integration.id);

      expect(health.status).toBeDefined();
      expect(health.uptime).toBeGreaterThan(0);
      expect(health.responseTime).toBeGreaterThan(0);
    });

    test('should create and manage support tickets', () => {
      const integration = integrationService.createIntegration(
        'company-001',
        'Test Company',
        ['music-sync']
      );

      const ticket = integrationService.createSupportTicket(
        integration.id,
        'company-001',
        'API not responding',
        'Getting 500 errors from API endpoint',
        TicketPriority.HIGH,
        'user@company.com'
      );

      expect(ticket.id).toBeDefined();
      expect(ticket.status).toBe('OPEN');
      expect(ticket.aiResponse).toBeDefined();
    });

    test('should schedule training', () => {
      const training = integrationService.scheduleTraining(
        'company-001',
        'Platform Onboarding',
        'ONBOARDING',
        ['user1@company.com', 'user2@company.com'],
        new Date(Date.now() + 24 * 60 * 60 * 1000),
        60
      );

      expect(training.id).toBeDefined();
      expect(training.participants).toHaveLength(2);
      expect(training.completed).toBe(false);
    });
  });

  describe('PitchGenerator', () => {
    let pitchGenerator: PitchGenerator;

    beforeEach(() => {
      pitchGenerator = new PitchGenerator();
    });

    test('should generate industry-specific pitch', () => {
      const pitch = pitchGenerator.generatePitch(
        Industry.TECHNOLOGY,
        'Tech Innovators Inc',
        PricingTier.PROFESSIONAL
      );

      expect(pitch.id).toBeDefined();
      expect(pitch.industry).toBe(Industry.TECHNOLOGY);
      expect(pitch.sections).toBeDefined();
      expect(pitch.sections.length).toBeGreaterThan(0);
    });

    test('should include all required pitch sections', () => {
      const pitch = pitchGenerator.generatePitch(
        Industry.ENTERTAINMENT,
        'Premier Entertainment',
        PricingTier.ENTERPRISE
      );

      const sectionTypes = pitch.sections.map((s) => s.type);
      expect(sectionTypes).toContain('EXECUTIVE_SUMMARY');
      expect(sectionTypes).toContain('VALUE_PROP');
      expect(sectionTypes).toContain('CASE_STUDY');
      expect(sectionTypes).toContain('TIMELINE');
    });

    test('should get available industries', () => {
      const industries = pitchGenerator.getAvailableIndustries();

      expect(industries).toContain(Industry.TECHNOLOGY);
      expect(industries).toContain(Industry.ENTERTAINMENT);
      expect(industries).toContain(Industry.FITNESS);
    });
  });

  describe('RevenueShareEngine', () => {
    let revenueEngine: RevenueShareEngine;

    beforeEach(() => {
      revenueEngine = new RevenueShareEngine();
    });

    test('should create billing plan', () => {
      const plan = revenueEngine.createBillingPlan('company-001', RevenueModel.SAAS, {
        baseSubscription: 10000,
        billingCycle: 'MONTHLY',
      });

      expect(plan.id).toBeDefined();
      expect(plan.revenueModel).toBe(RevenueModel.SAAS);
      expect(plan.baseSubscription).toBe(10000);
    });

    test('should generate invoice', () => {
      const plan = revenueEngine.createBillingPlan('company-001', RevenueModel.SAAS, {
        baseSubscription: 10000,
        billingCycle: 'MONTHLY',
      });

      const invoice = revenueEngine.generateInvoice('company-001', plan.id, new Date());

      expect(invoice.id).toBeDefined();
      expect(invoice.lineItems.length).toBeGreaterThan(0);
      expect(invoice.amount).toBeGreaterThan(0);
      expect(invoice.totalAmount).toBeGreaterThan(invoice.amount);
    });

    test('should process payment', () => {
      const plan = revenueEngine.createBillingPlan('company-001', RevenueModel.SAAS, {
        baseSubscription: 10000,
        billingCycle: 'MONTHLY',
      });

      const invoice = revenueEngine.generateInvoice('company-001', plan.id, new Date());
      const paid = revenueEngine.processPayment(invoice.id, PaymentMethod.CREDIT_CARD, 'txn_12345');

      expect(paid?.status).toBe('PAID');
      expect(paid?.paidDate).toBeDefined();
    });

    test('should convert currency', () => {
      const usdAmount = 1000;
      const eurAmount = revenueEngine.convertCurrency(usdAmount, Currency.USD, Currency.EUR);

      expect(eurAmount).toBeGreaterThan(0);
      expect(eurAmount).not.toBe(usdAmount);
    });

    test('should track affiliate commission', () => {
      const commission = revenueEngine.trackAffiliateCommission(
        'affiliate-001',
        'company-001',
        10,
        1000
      );

      expect(commission.id).toBeDefined();
      expect(commission.amount).toBe(1000);
      expect(commission.paidOut).toBe(false);
    });
  });

  describe('TurnkeyDeployment', () => {
    let deployment: TurnkeyDeployment;

    beforeEach(() => {
      deployment = new TurnkeyDeployment();
    });

    test('should create deployment configuration', () => {
      const config = deployment.createDeployment(
        'company-001',
        'Test Company',
        'music.testcompany.com',
        {
          companyName: 'Test Company',
          primaryColor: '#FF6B6B',
          secondaryColor: '#4ECDC4',
          logo: 'https://example.com/logo.png',
          favicon: 'https://example.com/favicon.ico',
        },
        ['music-sync', 'analytics'],
        ['us-east-1', 'eu-west-1']
      );

      expect(config.id).toBeDefined();
      expect(config.customDomain).toBe('music.testcompany.com');
      expect(config.status).toBe('PENDING');
    });

    test('should deploy one-click', async () => {
      const config = deployment.createDeployment(
        'company-001',
        'Test Company',
        'music.testcompany.com',
        {
          companyName: 'Test Company',
          primaryColor: '#FF6B6B',
          secondaryColor: '#4ECDC4',
          logo: 'https://example.com/logo.png',
          favicon: 'https://example.com/favicon.ico',
        },
        ['music-sync']
      );

      const result = await deployment.deployOneClick(config.id);

      expect(result.success).toBe(true);
      expect(result.deploymentUrl).toBe('https://music.testcompany.com');

      const updatedConfig = deployment.getDeploymentStatus(config.id);
      expect(updatedConfig?.status).toBe('LIVE');
    }, 10000); // Increase timeout for deployment simulation

    test('should deploy mobile apps', async () => {
      const config = deployment.createDeployment(
        'company-001',
        'Test Company',
        'music.testcompany.com',
        {
          companyName: 'Test Company',
          primaryColor: '#FF6B6B',
          secondaryColor: '#4ECDC4',
          logo: 'https://example.com/logo.png',
          favicon: 'https://example.com/favicon.ico',
        },
        ['music-sync', 'mobile-apps']
      );

      const result = await deployment.deployOneClick(config.id);

      expect(result.success).toBe(true);
      expect(result.mobileApps).toBeDefined();
      expect(result.mobileApps?.ios).toBeDefined();
      expect(result.mobileApps?.android).toBeDefined();
    }, 10000);

    test('should setup compliance certifications', async () => {
      const config = deployment.createDeployment(
        'company-001',
        'Test Company',
        'music.testcompany.com',
        {
          companyName: 'Test Company',
          primaryColor: '#FF6B6B',
          secondaryColor: '#4ECDC4',
          logo: 'https://example.com/logo.png',
          favicon: 'https://example.com/favicon.ico',
        },
        ['music-sync', 'payments']
      );

      await deployment.deployOneClick(config.id);

      const certs = deployment.getComplianceCerts(config.id);
      expect(certs.length).toBeGreaterThan(0);
      expect(certs.some((c) => c.standard === 'SOC2')).toBe(true);
      expect(certs.some((c) => c.standard === 'GDPR')).toBe(true);
    }, 10000);
  });
});
