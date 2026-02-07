import { License } from '../License';
import { LicenseType } from '../../types';

describe('License Model', () => {
  describe('Basic License Creation', () => {
    it('should create a license with basic fields', () => {
      const license = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
      });

      expect(license.id).toBeDefined();
      expect(license.trackId).toBe('track-123');
      expect(license.licenseType).toBe(LicenseType.SYNC);
      expect(license.licensee).toBe('Test Company');
      expect(license.fee).toBe(10000);
      expect(license.currency).toBe('USD');
      expect(license.status).toBe('ACTIVE');
    });
  });

  describe('Enhanced Publisher Information', () => {
    it('should create a license with publisher information', () => {
      const license = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
        publisher: {
          name: 'ScrollSoul Publishing',
          contactEmail: 'publisher@scrollsoul.com',
          contactPhone: '+1-555-0100',
          address: '123 Music Lane',
          taxId: 'TAX-123456',
        },
      });

      expect(license.publisher).toBeDefined();
      expect(license.publisher?.name).toBe('ScrollSoul Publishing');
      expect(license.publisher?.contactEmail).toBe('publisher@scrollsoul.com');
      expect(license.publisher?.taxId).toBe('TAX-123456');
    });

    it('should create a license with PRO identifiers', () => {
      const license = new License({
        trackId: 'track-123',
        licenseType: LicenseType.PERFORMANCE,
        licensee: 'Radio Station',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        fee: 5000,
        currency: 'USD',
        status: 'ACTIVE',
        proIdentifiers: {
          bmi: 'BMI-123456',
          ascap: 'ASCAP-789012',
          sesac: 'SESAC-345678',
        },
      });

      expect(license.proIdentifiers).toBeDefined();
      expect(license.proIdentifiers?.bmi).toBe('BMI-123456');
      expect(license.proIdentifiers?.ascap).toBe('ASCAP-789012');
      expect(license.proIdentifiers?.sesac).toBe('SESAC-345678');
    });
  });

  describe('Crypto Payment Support', () => {
    it('should create a license with crypto wallet information', () => {
      const license = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Digital Media Corp',
        territory: ['Worldwide'],
        startDate: new Date('2026-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
        cryptoWallet: {
          address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          network: 'Ethereum',
          currency: 'ETH',
          verified: true,
        },
        cryptoFee: 3.5,
        cryptoCurrency: 'ETH',
      });

      expect(license.cryptoWallet).toBeDefined();
      expect(license.cryptoWallet?.address).toBe('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
      expect(license.cryptoWallet?.network).toBe('Ethereum');
      expect(license.cryptoFee).toBe(3.5);
      expect(license.cryptoCurrency).toBe('ETH');
    });

    it('should check if crypto payment is enabled', () => {
      const licenseWithCrypto = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
        cryptoWallet: {
          address: '0x123',
          network: 'Ethereum',
          currency: 'ETH',
          verified: true,
        },
        cryptoFee: 3.5,
      });

      const licenseWithoutCrypto = new License({
        trackId: 'track-456',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
      });

      expect(licenseWithCrypto.hasCryptoPayment()).toBe(true);
      expect(licenseWithoutCrypto.hasCryptoPayment()).toBe(false);
    });

    it('should get total value including crypto', () => {
      const license = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
        cryptoFee: 3.5,
        cryptoCurrency: 'ETH',
      });

      const totalValue = license.getTotalValue();
      expect(totalValue.fiat).toBe(10000);
      expect(totalValue.crypto).toBe(3.5);
      expect(totalValue.cryptoCurrency).toBe('ETH');
    });
  });

  describe('License Status Management', () => {
    it('should check if license is active', () => {
      const activeLicense = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        endDate: new Date('2027-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
      });

      expect(activeLicense.isActive()).toBe(true);
    });

    it('should check if license is expired', () => {
      const expiredLicense = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
      });

      expect(expiredLicense.isExpired()).toBe(true);
    });
  });

  describe('License Update', () => {
    it('should update license fields', () => {
      const license = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
      });

      license.update({
        fee: 15000,
        publisher: {
          name: 'Updated Publisher',
          contactEmail: 'new@publisher.com',
        },
      });

      expect(license.fee).toBe(15000);
      expect(license.publisher?.name).toBe('Updated Publisher');
    });
  });

  describe('License JSON Serialization', () => {
    it('should serialize to JSON with all fields', () => {
      const license = new License({
        trackId: 'track-123',
        licenseType: LicenseType.SYNC,
        licensee: 'Test Company',
        territory: ['USA'],
        startDate: new Date('2026-01-01'),
        fee: 10000,
        currency: 'USD',
        status: 'ACTIVE',
        publisher: {
          name: 'Test Publisher',
          contactEmail: 'test@publisher.com',
        },
        proIdentifiers: {
          bmi: 'BMI-123',
        },
        cryptoWallet: {
          address: '0x123',
          network: 'Ethereum',
          currency: 'ETH',
          verified: true,
        },
        cryptoFee: 3.5,
      });

      const json = license.toJSON();
      expect(json.id).toBeDefined();
      expect(json.trackId).toBe('track-123');
      expect(json.publisher?.name).toBe('Test Publisher');
      expect(json.proIdentifiers?.bmi).toBe('BMI-123');
      expect(json.cryptoWallet?.address).toBe('0x123');
      expect(json.cryptoFee).toBe(3.5);
    });
  });
});
