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
import { RoseGoldEncryptionService } from '../RoseGoldEncryption';
import * as crypto from 'crypto';

describe('RoseGoldEncryptionService', () => {
  let encryption: RoseGoldEncryptionService;

  beforeEach(() => {
    encryption = new RoseGoldEncryptionService();
  });

  describe('AES-256-GCM Encryption', () => {
    test('should encrypt and decrypt data correctly', () => {
      const plaintext = Buffer.from('ScrollSoul Secret Data', 'utf8');
      const context = 'test-context';

      const encrypted = encryption.encryptStored(plaintext, context);
      const decrypted = encryption.decryptStored(encrypted, context);

      expect(decrypted.toString('utf8')).toBe(plaintext.toString('utf8'));
    });

    test('should produce different ciphertexts for same plaintext', () => {
      const plaintext = Buffer.from('Same data', 'utf8');
      const context = 'test-context';

      const encrypted1 = encryption.encryptStored(plaintext, context);
      const encrypted2 = encryption.encryptStored(plaintext, context);

      // Different IVs should produce different ciphertexts
      expect(encrypted1.iv.equals(encrypted2.iv)).toBe(false);
      expect(encrypted1.encrypted.equals(encrypted2.encrypted)).toBe(false);
    });

    test('should verify encryption strength (high entropy)', () => {
      const plaintext = crypto.randomBytes(1024);
      const encrypted = encryption.encryptStored(plaintext, 'test');

      // Calculate entropy of ciphertext
      const entropy = calculateEntropy(encrypted.encrypted);
      
      // High entropy indicates strong encryption (close to 8 bits/byte is ideal)
      expect(entropy).toBeGreaterThan(7.5);
    });

    test('should fail decryption with wrong context', () => {
      const plaintext = Buffer.from('Secret', 'utf8');
      const encrypted = encryption.encryptStored(plaintext, 'context-a');

      expect(() => {
        encryption.decryptStored(encrypted, 'context-b');
      }).toThrow();
    });

    test('should fail decryption with tampered data', () => {
      const plaintext = Buffer.from('Secret', 'utf8');
      const encrypted = encryption.encryptStored(plaintext, 'test');

      // Tamper with encrypted data
      encrypted.encrypted[0] ^= 0xFF;

      expect(() => {
        encryption.decryptStored(encrypted, 'test');
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
  describe('ChaCha20-Poly1305 Streaming Encryption', () => {
    test('should encrypt and decrypt stream data', () => {
      const data = Buffer.from('Streaming video data for ScrollSoul', 'utf8');

      const encrypted = encryption.encryptStream(data);
      const decrypted = encryption.decryptStream(
        encrypted.encrypted,
        encrypted.nonce,
        encrypted.authTag
      );

      expect(decrypted.toString('utf8')).toBe(data.toString('utf8'));
    });

    test('should produce different nonces for each encryption', () => {
      const data = Buffer.from('Stream data', 'utf8');

      const encrypted1 = encryption.encryptStream(data);
      const encrypted2 = encryption.encryptStream(data);

      expect(encrypted1.nonce.equals(encrypted2.nonce)).toBe(false);
    });
  });

  describe('Cryptographic Primitives', () => {
    test('should generate secure random bytes', () => {
      const random1 = encryption.randomBytes(32);
      const random2 = encryption.randomBytes(32);

      expect(random1.length).toBe(32);
      expect(random2.length).toBe(32);
      expect(random1.equals(random2)).toBe(false);
    });

    test('should compute HMAC correctly', () => {
      const data = Buffer.from('message', 'utf8');
      const key = crypto.randomBytes(32);

      const hmac1 = encryption.hmac(data, key);
      const hmac2 = encryption.hmac(data, key);

      expect(hmac1.equals(hmac2)).toBe(true);
      expect(hmac1.length).toBe(32); // SHA-256 produces 32-byte hash
    });

    test('should derive keys using KDF', () => {
      const secret = Buffer.from('shared-secret', 'utf8');
      const salt = crypto.randomBytes(16);

      const key1 = encryption.kdf(secret, salt);
      const key2 = encryption.kdf(secret, salt);

      expect(key1.equals(key2)).toBe(true);
      expect(key1.length).toBe(32); // 256-bit key
    });

    test('should hash data with SHA-256', () => {
      const data = Buffer.from('data to hash', 'utf8');

      const hash = encryption.hash(data);

      expect(hash.length).toBe(32); // SHA-256 produces 32-byte hash
    });

    test('should perform constant-time comparison', () => {
      const buf1 = Buffer.from('same', 'utf8');
      const buf2 = Buffer.from('same', 'utf8');
      const buf3 = Buffer.from('diff', 'utf8');
      const buf4 = Buffer.from('different', 'utf8'); // Different length

      expect(encryption.secureCompare(buf1, buf2)).toBe(true);
      
      // timingSafeEqual throws for different length buffers
      expect(() => {
        encryption.secureCompare(buf1, buf4);
      }).toThrow();
      
      // timingSafeEqual returns false for same length but different content
      expect(encryption.secureCompare(buf1, buf3)).toBe(false);
    });
  });
});

/**
 * Calculate Shannon entropy of data
 */
function calculateEntropy(buffer: Buffer): number {
  const frequencies: { [key: number]: number } = {};
  
  for (const byte of buffer) {
    frequencies[byte] = (frequencies[byte] || 0) + 1;
  }
  
  let entropy = 0;
  const length = buffer.length;
  
  for (const count of Object.values(frequencies)) {
    const probability = count / length;
    entropy -= probability * Math.log2(probability);
  }
  
  return entropy;
}
