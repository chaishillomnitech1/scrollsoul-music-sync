import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as speakeasy from 'speakeasy';

/**
 * Session token
 */
export interface SessionToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * MFA configuration
 */
export interface MFAConfig {
  method: 'totp' | 'sms' | 'webauthn';
  qrCode?: string;
  secret?: string;
  challenge?: string;
}

/**
 * Biometric data (device-local verification)
 */
export interface BiometricData {
  type: 'fingerprint' | 'face' | 'iris';
  hash: string;
}

/**
 * JWT payload
 */
interface JWTPayload {
  sub: string; // User ID
  iat: number; // Issued at
  exp: number; // Expiry
  jti: string; // JWT ID
  type: 'access' | 'refresh';
}

/**
 * Authentication Service
 * Handles user authentication, MFA, and session management
 */
export class AuthService {
  private jwtSecret: string;
  private refreshTokenSecret: string;
  private totpSecrets: Map<string, string> = new Map();
  private sessions: Map<string, string> = new Map(); // jti -> userId
  private refreshTokens: Map<string, string> = new Map(); // token -> userId
  private failedLoginAttempts: Map<string, number> = new Map();
  private accountLocks: Map<string, number> = new Map(); // userId -> lockUntil timestamp

  constructor(jwtSecret?: string) {
    this.jwtSecret = jwtSecret || crypto.randomBytes(64).toString('hex');
    this.refreshTokenSecret = crypto.randomBytes(64).toString('hex');
  }

  /**
   * Enable MFA for user
   */
  async enableMFA(userId: string, method: 'totp' | 'sms' | 'webauthn'): Promise<MFAConfig> {
    switch (method) {
      case 'totp': {
        const secret = speakeasy.generateSecret({
          name: `ScrollSoul (${userId})`,
          issuer: 'ScrollSoul Empire',
        });
        
        await this.storeTOTPSecret(userId, secret.base32);
        
        return {
          method: 'totp',
          qrCode: secret.otpauth_url,
          secret: secret.base32,
        };
      }
      
      case 'webauthn': {
        const challenge = crypto.randomBytes(32).toString('base64');
        return {
          method: 'webauthn',
          challenge,
        };
      }
      
      case 'sms': {
        // In production, would send SMS code
        return {
          method: 'sms',
        };
      }
    }
  }

  /**
   * Verify TOTP token
   */
  async verifyTOTP(userId: string, token: string): Promise<boolean> {
    const secret = this.totpSecrets.get(userId);
    if (!secret) {
      return false;
    }

    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2, // Allow 2 time steps in either direction
    });
  }

  /**
   * Store TOTP secret for user
   */
  private async storeTOTPSecret(userId: string, secret: string): Promise<void> {
    this.totpSecrets.set(userId, secret);
  }

  /**
   * Get TOTP secret for user
   */
  getTOTPSecret(userId: string): string | undefined {
    return this.totpSecrets.get(userId);
  }

  /**
   * Verify biometric data (device-local verification)
   */
  async verifyBiometric(userId: string, biometricData: BiometricData): Promise<boolean> {
    // In production, this would use device-local biometric verification
    // Never store biometric templates server-side
    // This is a placeholder that always returns true for demonstration
    return true;
  }

  /**
   * Create session with JWT
   */
  async createSession(userId: string): Promise<SessionToken> {
    const jti = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = 15 * 60; // 15 minutes

    const payload: JWTPayload = {
      sub: userId,
      iat: now,
      exp: now + expiresIn,
      jti,
      type: 'access',
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      algorithm: 'HS256', // Using HMAC for simplicity; RS256 recommended for production
    });

    // Store session for revocation
    this.sessions.set(jti, userId);

    // Create refresh token
    const refreshToken = await this.createRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Create refresh token
   */
  private async createRefreshToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    this.refreshTokens.set(token, userId);
    return token;
  }

  /**
   * Verify access token
   */
  async verifyAccessToken(token: string): Promise<string | null> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JWTPayload;
      
      // Check if session is still valid (not revoked)
      if (!this.sessions.has(payload.jti)) {
        return null;
      }
      
      return payload.sub;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  async verifyRefreshToken(token: string): Promise<string | null> {
    return this.refreshTokens.get(token) || null;
  }

  /**
   * Refresh session (rotate tokens)
   */
  async refreshSession(refreshToken: string): Promise<SessionToken | null> {
    const userId = await this.verifyRefreshToken(refreshToken);
    
    if (!userId) {
      return null;
    }
    
    // Revoke old refresh token (prevent reuse)
    await this.revokeRefreshToken(refreshToken);
    
    // Issue new pair
    return this.createSession(userId);
  }

  /**
   * Revoke refresh token
   */
  async revokeRefreshToken(token: string): Promise<void> {
    this.refreshTokens.delete(token);
  }

  /**
   * Revoke all sessions for user
   */
  async revokeAllSessions(userId: string): Promise<void> {
    // Remove all sessions for user
    for (const [jti, uid] of this.sessions.entries()) {
      if (uid === userId) {
        this.sessions.delete(jti);
      }
    }
    
    // Remove all refresh tokens for user
    for (const [token, uid] of this.refreshTokens.entries()) {
      if (uid === userId) {
        this.refreshTokens.delete(token);
      }
    }
  }

  /**
   * Revoke specific session
   */
  async revokeSession(jti: string): Promise<void> {
    this.sessions.delete(jti);
  }

  /**
   * Check if account is locked
   */
  isAccountLocked(userId: string): boolean {
    const lockUntil = this.accountLocks.get(userId);
    if (!lockUntil) return false;
    
    if (Date.now() < lockUntil) {
      return true;
    }
    
    // Lock expired, remove it
    this.accountLocks.delete(userId);
    this.failedLoginAttempts.delete(userId);
    return false;
  }

  /**
   * Record failed login attempt
   */
  recordFailedLogin(userId: string): void {
    const attempts = (this.failedLoginAttempts.get(userId) || 0) + 1;
    this.failedLoginAttempts.set(userId, attempts);
    
    // Lock account after 5 failed attempts
    if (attempts >= 5) {
      const lockDuration = 15 * 60 * 1000; // 15 minutes
      this.accountLocks.set(userId, Date.now() + lockDuration);
    }
  }

  /**
   * Reset failed login attempts
   */
  resetFailedLogins(userId: string): void {
    this.failedLoginAttempts.delete(userId);
    this.accountLocks.delete(userId);
  }

  /**
   * Login (simplified - in production, verify against database)
   */
  async login(userId: string, password: string): Promise<SessionToken> {
    // Check if account is locked
    if (this.isAccountLocked(userId)) {
      throw new Error('ACCOUNT_LOCKED');
    }
    
    // In production, verify password hash against database
    // For demonstration, we'll accept any password
    const isValidPassword = true; // Replace with actual password verification
    
    if (!isValidPassword) {
      this.recordFailedLogin(userId);
      throw new Error('INVALID_CREDENTIALS');
    }
    
    // Reset failed login attempts on successful login
    this.resetFailedLogins(userId);
    
    // Create session
    return this.createSession(userId);
  }

  /**
   * Get JWT secret (for testing)
   */
  getJWTSecret(): string {
    return this.jwtSecret;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      activeSessions: this.sessions.size,
      activeRefreshTokens: this.refreshTokens.size,
      mfaEnabledUsers: this.totpSecrets.size,
      lockedAccounts: this.accountLocks.size,
    };
  }
}
