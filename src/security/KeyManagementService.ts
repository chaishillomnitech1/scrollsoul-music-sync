import * as crypto from 'crypto';
import * as argon2 from 'argon2';

/**
 * Master key interface
 */
export interface MasterKey {
  id: string;
  key: Buffer;
  algorithm: string;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Data Encryption Key (DEK)
 */
export interface DataEncryptionKey {
  id: string;
  tenantId: string;
  encryptedKey: Buffer;
  algorithm: string;
  createdAt: Date;
}

/**
 * Key Management Service
 * Handles encryption key lifecycle, rotation, and derivation
 */
export class KeyManagementService {
  private currentMasterKey: MasterKey;
  private tenantKeys: Map<string, DataEncryptionKey> = new Map();
  private userSalts: Map<string, Buffer> = new Map();

  constructor() {
    // Initialize with a master key
    this.currentMasterKey = this.generateMasterKeySync();
  }

  /**
   * Generate a master key (synchronous version for initialization)
   * In production, this would integrate with AWS KMS, Azure Key Vault, or HSM
   */
  private generateMasterKeySync(): MasterKey {
    return {
      id: crypto.randomUUID(),
      key: crypto.randomBytes(32), // 256-bit key
      algorithm: 'AES-256',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    };
  }

  /**
   * Generate a master key (async for HSM integration)
   * In production, integrate with AWS KMS, Azure Key Vault, or HSM
   */
  async generateMasterKey(): Promise<MasterKey> {
    // Simulate async HSM operation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.generateMasterKeySync());
      }, 10);
    });
  }

  /**
   * Get current master key
   */
  getCurrentMasterKey(): MasterKey {
    return this.currentMasterKey;
  }

  /**
   * Rotate master key (every 90 days recommended)
   */
  async rotateKeys(): Promise<void> {
    const newMasterKey = await this.generateMasterKey();

    // Re-encrypt all DEKs with new master key
    for (const [tenantId, dek] of this.tenantKeys.entries()) {
      // Decrypt with old master key
      const decryptedDEK = this.decrypt(dek.encryptedKey, this.currentMasterKey.key);
      
      // Re-encrypt with new master key
      const newEncryptedDEK = this.encrypt(decryptedDEK, newMasterKey.key);
      
      // Update stored DEK
      this.tenantKeys.set(tenantId, {
        ...dek,
        encryptedKey: newEncryptedDEK,
      });
    }

    this.currentMasterKey = newMasterKey;
  }

  /**
   * Encrypt data with a key
   */
  private encrypt(data: Buffer, key: Buffer): Buffer {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    
    // Prepend IV to encrypted data
    return Buffer.concat([iv, encrypted]);
  }

  /**
   * Decrypt data with a key
   */
  private decrypt(encryptedData: Buffer, key: Buffer): Buffer {
    // Extract IV from beginning
    const iv = encryptedData.subarray(0, 16);
    const encrypted = encryptedData.subarray(16);
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    
    return decrypted;
  }

  /**
   * Get or generate DEK (Data Encryption Key) for tenant
   */
  async getDEK(tenantId: string): Promise<Buffer> {
    let dek = this.tenantKeys.get(tenantId);
    
    if (!dek) {
      // Generate new DEK
      const plainDEK = crypto.randomBytes(32);
      const encryptedDEK = this.encrypt(plainDEK, this.currentMasterKey.key);
      
      dek = {
        id: crypto.randomUUID(),
        tenantId,
        encryptedKey: encryptedDEK,
        algorithm: 'AES-256',
        createdAt: new Date(),
      };
      
      this.tenantKeys.set(tenantId, dek);
      return plainDEK;
    }
    
    // Decrypt existing DEK
    return this.decrypt(dek.encryptedKey, this.currentMasterKey.key);
  }

  /**
   * Set custom tenant key (BYOK - Bring Your Own Key)
   */
  async setTenantKey(tenantId: string, key: Buffer): Promise<void> {
    // Wrap tenant key with master key
    const wrapped = this.encrypt(key, this.currentMasterKey.key);
    
    const dek: DataEncryptionKey = {
      id: crypto.randomUUID(),
      tenantId,
      encryptedKey: wrapped,
      algorithm: 'AES-256',
      createdAt: new Date(),
    };
    
    this.tenantKeys.set(tenantId, dek);
  }

  /**
   * Get or generate salt for user
   */
  getUserSalt(userId: string): Buffer {
    let salt = this.userSalts.get(userId);
    if (!salt) {
      salt = crypto.randomBytes(16);
      this.userSalts.set(userId, salt);
    }
    return salt;
  }

  /**
   * Zero-knowledge key derivation using Argon2id
   */
  async deriveUserKey(userId: string, password: string): Promise<Buffer> {
    const salt = this.getUserSalt(userId);
    
    const hash = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,
      parallelism: 4,
      salt,
      raw: true, // Return raw hash buffer
      hashLength: 32, // 256-bit key
    });
    
    return Buffer.from(hash);
  }

  /**
   * Verify password-derived key
   */
  async verifyUserKey(userId: string, password: string, expectedHash: Buffer): Promise<boolean> {
    const derivedKey = await this.deriveUserKey(userId, password);
    
    try {
      return crypto.timingSafeEqual(derivedKey, expectedHash);
    } catch {
      return false;
    }
  }

  /**
   * Delete user keys (for GDPR compliance)
   */
  async deleteUserKeys(userId: string): Promise<void> {
    this.userSalts.delete(userId);
  }

  /**
   * Wrap a key with another key (for key protection)
   */
  wrapKey(keyToWrap: Buffer, wrappingKey: Buffer): Buffer {
    return this.encrypt(keyToWrap, wrappingKey);
  }

  /**
   * Unwrap a key
   */
  unwrapKey(wrappedKey: Buffer, wrappingKey: Buffer): Buffer {
    return this.decrypt(wrappedKey, wrappingKey);
  }

  /**
   * Get all tenant IDs
   */
  getAllTenants(): { id: string }[] {
    return Array.from(this.tenantKeys.keys()).map((id) => ({ id }));
  }

  /**
   * Store DEK (in production, this would be in a secure database)
   */
  async storeDEK(tenantId: string, encryptedDEK: Buffer): Promise<void> {
    const existing = this.tenantKeys.get(tenantId);
    if (existing) {
      existing.encryptedKey = encryptedDEK;
    }
  }

  /**
   * Get statistics about key management
   */
  getStats() {
    return {
      masterKeyAge: Date.now() - this.currentMasterKey.createdAt.getTime(),
      masterKeyExpiresIn: this.currentMasterKey.expiresAt
        ? this.currentMasterKey.expiresAt.getTime() - Date.now()
        : null,
      tenantKeysCount: this.tenantKeys.size,
      userSaltsCount: this.userSalts.size,
    };
  }
}
