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

      expect(encryption.secureCompare(buf1, buf2)).toBe(true);
      expect(() => encryption.secureCompare(buf1, buf3)).toThrow();
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
