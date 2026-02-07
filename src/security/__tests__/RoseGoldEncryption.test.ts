/**
 * Rose Gold Encryption Service Tests
 */

import { RoseGoldEncryptionService } from '../RoseGoldEncryption';

describe('RoseGoldEncryptionService', () => {
  let encryption: RoseGoldEncryptionService;
  const testMasterKey = 'a'.repeat(64); // 64-character hex string

  beforeEach(() => {
    encryption = new RoseGoldEncryptionService(testMasterKey);
  });

  describe('encryptNFTMetadata and decryptNFTMetadata', () => {
    it('should encrypt and decrypt NFT metadata', () => {
      const metadata = {
        tokenId: '123',
        owner: '0xabc',
        name: 'Test NFT',
        attributes: [
          { trait_type: 'Rarity', value: 'Legendary' },
        ],
      };

      const encrypted = encryption.encryptNFTMetadata(metadata);

      expect(encrypted).toBeDefined();
      expect(encrypted.encrypted).toBeDefined();
      expect(encrypted.iv).toBeDefined();
      expect(encrypted.authTag).toBeDefined();
      expect(encrypted.algorithm).toBe('aes-256-gcm');

      const decrypted = encryption.decryptNFTMetadata(encrypted);

      expect(decrypted).toEqual(metadata);
    });

    it('should produce different encrypted values for same data', () => {
      const metadata = { tokenId: '123', name: 'Test' };

      const encrypted1 = encryption.encryptNFTMetadata(metadata);
      const encrypted2 = encryption.encryptNFTMetadata(metadata);

      // Different IVs should produce different encrypted values
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
      expect(encrypted1.encrypted).not.toBe(encrypted2.encrypted);

      // But both should decrypt to the same value
      expect(encryption.decryptNFTMetadata(encrypted1)).toEqual(metadata);
      expect(encryption.decryptNFTMetadata(encrypted2)).toEqual(metadata);
    });

    it('should throw error on tampered data', () => {
      const metadata = { tokenId: '123' };
      const encrypted = encryption.encryptNFTMetadata(metadata);

      // Tamper with encrypted data
      encrypted.encrypted = 'tampered_data';

      expect(() => {
        encryption.decryptNFTMetadata(encrypted);
      }).toThrow();
    });
  });

  describe('hashData', () => {
    it('should hash data consistently', () => {
      const data = 'test data';
      
      const hash1 = encryption.hashData(data);
      const hash2 = encryption.hashData(data);

      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produces 64 hex characters
    });

    it('should produce different hashes for different data', () => {
      const hash1 = encryption.hashData('data1');
      const hash2 = encryption.hashData('data2');

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateSalt', () => {
    it('should generate random salt', () => {
      const salt1 = encryption.generateSalt();
      const salt2 = encryption.generateSalt();

      expect(salt1).toBeDefined();
      expect(salt2).toBeDefined();
      expect(salt1).not.toBe(salt2);
      expect(salt1).toHaveLength(32); // 16 bytes = 32 hex characters
    });
  });
});
