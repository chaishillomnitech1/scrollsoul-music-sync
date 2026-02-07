import * as crypto from 'crypto';

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  encrypted: Buffer;
  iv: Buffer;
  authTag: Buffer;
  algorithm: string;
  version: string;
}

/**
 * Encrypted blockchain data structure
 */
export interface EncryptedBlockchainData {
  ephemeralPublicKey: Buffer;
  encrypted: EncryptedData;
  mac: Buffer;
}

/**
 * Rose Gold Encryption Service
 * Military-grade encryption for ScrollSoul data
 */
export class RoseGoldEncryptionService {
  private masterKey: Buffer;
  private contextKeys: Map<string, Buffer> = new Map();

  constructor(masterKey?: Buffer) {
    // Generate or use provided master key
    this.masterKey = masterKey || crypto.randomBytes(32); // 256-bit key
  }

  /**
   * Derive context-specific key from master key
   */
  private deriveContextKey(context: string): Buffer {
    // Check cache first
    if (this.contextKeys.has(context)) {
      return this.contextKeys.get(context)!;
    }

    // Derive key using HKDF (HMAC-based Key Derivation Function)
    const salt = Buffer.from(context, 'utf8');
    const info = Buffer.from('scrollsoul-rose-gold', 'utf8');
    
    const keyBuffer = crypto.hkdfSync(
      'sha256',
      this.masterKey,
      salt,
      info,
      32 // 256-bit output key
    );

    const key = Buffer.from(keyBuffer);
    this.contextKeys.set(context, key);
    return key;
  }

  /**
   * AES-256-GCM encryption for stored data
   * - 256-bit keys
   * - Galois/Counter Mode for authenticated encryption
   * - Unique IV per encryption operation
   */
  encryptStored(data: Buffer, context: string): EncryptedData {
    const key = this.deriveContextKey(context);
    const iv = crypto.randomBytes(12); // 96-bit IV for GCM
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv,
      authTag,
      algorithm: 'AES-256-GCM',
      version: '1.0',
    };
  }

  /**
   * Decrypt AES-256-GCM encrypted data
   */
  decryptStored(encryptedData: EncryptedData, context: string): Buffer {
    const key = this.deriveContextKey(context);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, encryptedData.iv);
    
    decipher.setAuthTag(encryptedData.authTag);
    
    const decrypted = Buffer.concat([
      decipher.update(encryptedData.encrypted),
      decipher.final(),
    ]);

    return decrypted;
  }

  /**
   * ChaCha20-Poly1305 encryption for streaming data
   * - High performance for real-time encryption
   * - Resistance to timing attacks
   */
  encryptStream(data: Buffer): { encrypted: Buffer; nonce: Buffer; authTag: Buffer } {
    const key = this.masterKey;
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('chacha20-poly1305', key, nonce, {
      authTagLength: 16,
    });

    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      nonce,
      authTag,
    };
  }

  /**
   * Decrypt ChaCha20-Poly1305 encrypted data
   */
  decryptStream(
    encrypted: Buffer,
    nonce: Buffer,
    authTag: Buffer
  ): Buffer {
    const key = this.masterKey;
    const decipher = crypto.createDecipheriv('chacha20-poly1305', key, nonce, {
      authTagLength: 16,
    });

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted;
  }

  /**
   * HMAC for message authentication
   */
  hmac(data: Buffer, key: Buffer): Buffer {
    return crypto.createHmac('sha256', key).update(data).digest();
  }

  /**
   * Key Derivation Function using PBKDF2
   */
  kdf(secret: Buffer, salt?: Buffer, iterations: number = 100000): Buffer {
    const _salt = salt || crypto.randomBytes(16);
    return crypto.pbkdf2Sync(secret, _salt, iterations, 32, 'sha256');
  }

  /**
   * Generate random bytes (for IVs, salts, etc.)
   */
  randomBytes(length: number): Buffer {
    return crypto.randomBytes(length);
  }

  /**
   * Hash data using SHA-256
   */
  hash(data: Buffer): Buffer {
    return crypto.createHash('sha256').update(data).digest();
  }

  /**
   * Constant-time comparison to prevent timing attacks
   */
  secureCompare(a: Buffer, b: Buffer): boolean {
    return crypto.timingSafeEqual(a, b);
  }
}
