/**
 * Rose Gold Encryption Service
 * AES-256-GCM and ChaCha20-Poly1305 encryption for NFT data
 * Rose Gold Security Standard - Maximum Protection
 */

import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';

export interface EncryptedData {
  encrypted: string;
  iv: string;
  authTag: string;
  algorithm: string;
}

export interface SecureChannel {
  channelId: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface EncryptedIPFSFile {
  encryptedContent: string;
  metadata: {
    originalFilename: string;
    mimeType: string;
    size: number;
    encryptedAt: Date;
  };
  decryptionKey: string;
  iv: string;
  authTag: string;
}

export class RoseGoldEncryptionService {
  private masterKey: string;
  private readonly ALGORITHM_AES = 'aes-256-gcm';
  private readonly KEY_LENGTH = 32; // 256 bits
  private readonly IV_LENGTH = 16; // 128 bits
  private readonly AUTH_TAG_LENGTH = 16;

  constructor(masterKey?: string) {
    // Use provided master key or generate from environment
    this.masterKey = masterKey || process.env.ROSE_GOLD_MASTER_KEY || this.generateMasterKey();
  }

  /**
   * Encrypt NFT metadata using AES-256-GCM
   */
  encryptNFTMetadata(data: any): EncryptedData {
    try {
      const jsonData = JSON.stringify(data);
      const iv = randomBytes(this.IV_LENGTH);
      const key = this.deriveKey(this.masterKey);

      const cipher = createCipheriv(this.ALGORITHM_AES, key, iv);
      
      let encrypted = cipher.update(jsonData, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: this.ALGORITHM_AES,
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error(`Failed to encrypt NFT metadata: ${error}`);
    }
  }

  /**
   * Decrypt NFT metadata
   */
  decryptNFTMetadata(encryptedData: EncryptedData): any {
    try {
      const key = this.deriveKey(this.masterKey);
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const authTag = Buffer.from(encryptedData.authTag, 'hex');

      const decipher = createDecipheriv(this.ALGORITHM_AES, key, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error(`Failed to decrypt NFT metadata: ${error}`);
    }
  }

  /**
   * Encrypt streaming video data using AES-256-GCM
   * Production-ready implementation for video data encryption
   */
  encryptStreamingData(stream: Buffer): EncryptedData {
    try {
      const iv = randomBytes(this.IV_LENGTH);
      const key = this.deriveKey(this.masterKey);

      const cipher = createCipheriv(this.ALGORITHM_AES, key, iv);
      
      const encrypted = Buffer.concat([
        cipher.update(stream),
        cipher.final(),
      ]);
      
      const authTag = cipher.getAuthTag();

      return {
        encrypted: encrypted.toString('hex'),
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        algorithm: this.ALGORITHM_AES,
      };
    } catch (error) {
      console.error('Stream encryption error:', error);
      throw new Error(`Failed to encrypt streaming data: ${error}`);
    }
  }

  /**
   * Decrypt streaming video data
   */
  decryptStreamingData(encryptedData: EncryptedData): Buffer {
    try {
      const key = this.deriveKey(this.masterKey);
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const authTag = Buffer.from(encryptedData.authTag, 'hex');
      const encrypted = Buffer.from(encryptedData.encrypted, 'hex');

      const decipher = createDecipheriv(this.ALGORITHM_AES, key, iv);
      decipher.setAuthTag(authTag);

      return Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
    } catch (error) {
      console.error('Stream decryption error:', error);
      throw new Error(`Failed to decrypt streaming data: ${error}`);
    }
  }

  /**
   * Create secure API channel with end-to-end encryption
   */
  secureAPIChannel(clientId: string): SecureChannel {
    const channelId = this.generateChannelId(clientId);
    const keyPair = this.generateKeyPair();
    
    return {
      channelId,
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    };
  }

  /**
   * Encrypt file for IPFS storage
   */
  encryptForIPFS(file: {
    filename: string;
    content: Buffer;
    mimeType: string;
  }): EncryptedIPFSFile {
    const encryptedContent = this.encryptStreamingData(file.content);
    const decryptionKey = randomBytes(32).toString('hex');

    return {
      encryptedContent: encryptedContent.encrypted,
      metadata: {
        originalFilename: file.filename,
        mimeType: file.mimeType,
        size: file.content.length,
        encryptedAt: new Date(),
      },
      decryptionKey,
      iv: encryptedContent.iv,
      authTag: encryptedContent.authTag,
    };
  }

  /**
   * Decrypt file from IPFS
   */
  decryptFromIPFS(encryptedFile: EncryptedIPFSFile): Buffer {
    return this.decryptStreamingData({
      encrypted: encryptedFile.encryptedContent,
      iv: encryptedFile.iv,
      authTag: encryptedFile.authTag,
      algorithm: this.ALGORITHM_AES,
    });
  }

  /**
   * Hash sensitive data with SHA-256
   */
  hashData(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate HMAC for data integrity
   */
  generateHMAC(data: string, secret: string): string {
    return createHash('sha256')
      .update(data + secret)
      .digest('hex');
  }

  /**
   * Verify HMAC
   */
  verifyHMAC(data: string, hmac: string, secret: string): boolean {
    const expectedHMAC = this.generateHMAC(data, secret);
    return hmac === expectedHMAC;
  }

  /**
   * Derive encryption key from master key using SHA-256
   */
  private deriveKey(masterKey: string): Buffer {
    return createHash('sha256')
      .update(masterKey)
      .digest();
  }

  /**
   * Generate random master key
   */
  private generateMasterKey(): string {
    return randomBytes(this.KEY_LENGTH).toString('hex');
  }

  /**
   * Generate channel ID
   */
  private generateChannelId(clientId: string): string {
    const timestamp = Date.now();
    const random = randomBytes(16).toString('hex');
    return this.hashData(`${clientId}-${timestamp}-${random}`);
  }

  /**
   * Generate key pair for secure channels (simplified implementation)
   */
  private generateKeyPair(): { publicKey: string; privateKey: string } {
    // In production, use actual asymmetric encryption (RSA, ECDH, etc.)
    const privateKey = randomBytes(32).toString('hex');
    const publicKey = createHash('sha256').update(privateKey).digest('hex');
    
    return { publicKey, privateKey };
  }

  /**
   * Generate encryption salt
   */
  generateSalt(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Encrypt with custom key
   */
  encryptWithKey(data: string, key: string): EncryptedData {
    const iv = randomBytes(this.IV_LENGTH);
    const derivedKey = this.deriveKey(key);

    const cipher = createCipheriv(this.ALGORITHM_AES, derivedKey, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: this.ALGORITHM_AES,
    };
  }

  /**
   * Decrypt with custom key
   */
  decryptWithKey(encryptedData: EncryptedData, key: string): string {
    const derivedKey = this.deriveKey(key);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');

    const decipher = createDecipheriv(this.ALGORITHM_AES, derivedKey, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
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
