import { TenantService } from '../multi-tenant/TenantService';

describe('TenantService', () => {
  let tenantService: TenantService;

  beforeEach(() => {
    tenantService = new TenantService();
  });

  describe('createTenant', () => {
    it('should create a new tenant with default limits based on tier', async () => {
      const tenant = await tenantService.createTenant({
        companyName: 'Acme Corp',
        tier: 'PROFESSIONAL',
        adminEmail: 'admin@acme.com',
        billingEmail: 'billing@acme.com',
      });

      expect(tenant).toBeDefined();
      expect(tenant.companyName).toBe('Acme Corp');
      expect(tenant.tier).toBe('PROFESSIONAL');
      expect(tenant.limits.videosPerMonth).toBe(50);
      expect(tenant.limits.apiCallsPerDay).toBe(1000);
      expect(tenant.users).toHaveLength(1);
      expect(tenant.users[0].email).toBe('admin@acme.com');
      expect(tenant.users[0].role).toBe('ADMIN');
    });

    it('should create starter tier with correct limits', async () => {
      const tenant = await tenantService.createTenant({
        companyName: 'Startup Inc',
        tier: 'STARTER',
        adminEmail: 'admin@startup.com',
        billingEmail: 'billing@startup.com',
      });

      expect(tenant.limits.videosPerMonth).toBe(10);
      expect(tenant.limits.storageGB).toBe(5);
      expect(tenant.limits.teamMembers).toBe(1);
    });

    it('should create enterprise tier with unlimited resources', async () => {
      const tenant = await tenantService.createTenant({
        companyName: 'Enterprise LLC',
        tier: 'ENTERPRISE',
        adminEmail: 'admin@enterprise.com',
        billingEmail: 'billing@enterprise.com',
      });

      expect(tenant.limits.videosPerMonth).toBe(-1); // unlimited
      expect(tenant.limits.apiCallsPerDay).toBe(-1); // unlimited
    });
  });

  describe('updateTenantTier', () => {
    it('should upgrade tenant tier and update limits', async () => {
      const tenant = await tenantService.createTenant({
        companyName: 'Test Co',
        tier: 'STARTER',
        adminEmail: 'admin@test.com',
        billingEmail: 'billing@test.com',
      });

      const upgraded = await tenantService.updateTenantTier(tenant.id, 'PROFESSIONAL');

      expect(upgraded.tier).toBe('PROFESSIONAL');
      expect(upgraded.limits.videosPerMonth).toBe(50);
    });
  });

  describe('createAPIKey', () => {
    it('should create API key for tenant', async () => {
      const tenant = await tenantService.createTenant({
        companyName: 'API Test',
        tier: 'PROFESSIONAL',
        adminEmail: 'admin@apitest.com',
        billingEmail: 'billing@apitest.com',
      });

      const apiKey = await tenantService.createAPIKey(tenant.id, 'Production Key');

      expect(apiKey).toBeDefined();
      expect(apiKey.name).toBe('Production Key');
      expect(apiKey.key).toContain('sk_');
      expect(apiKey.isActive).toBe(true);
    });
  });

  describe('checkUsageLimits', () => {
    it('should return true when under limits', async () => {
      const tenant = await tenantService.createTenant({
        companyName: 'Limit Test',
        tier: 'STARTER',
        adminEmail: 'admin@limit.com',
        billingEmail: 'billing@limit.com',
      });

      const withinLimit = await tenantService.checkUsageLimits(
        tenant.id,
        'videosPerMonth',
        5
      );

      expect(withinLimit).toBe(true);
    });

    it('should return false when over limits', async () => {
      const tenant = await tenantService.createTenant({
        companyName: 'Limit Test',
        tier: 'STARTER',
        adminEmail: 'admin@limit.com',
        billingEmail: 'billing@limit.com',
      });

      const overLimit = await tenantService.checkUsageLimits(
        tenant.id,
        'videosPerMonth',
        15
      );

      expect(overLimit).toBe(false);
    });

    it('should always return true for unlimited resources', async () => {
      const tenant = await tenantService.createTenant({
        companyName: 'Enterprise',
        tier: 'ENTERPRISE',
        adminEmail: 'admin@enterprise.com',
        billingEmail: 'billing@enterprise.com',
      });

      const withinLimit = await tenantService.checkUsageLimits(
        tenant.id,
        'videosPerMonth',
        10000
      );

      expect(withinLimit).toBe(true);
    });
  });
});
