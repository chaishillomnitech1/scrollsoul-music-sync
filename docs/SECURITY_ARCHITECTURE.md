# Security Architecture

## 🔒 Rose Gold Encryption - Maximum Security Standard

ScrollSoul implements military-grade encryption and security measures to protect NFT data, videos, and user information.

## Table of Contents

- [Overview](#overview)
- [Encryption Standards](#encryption-standards)
- [Rose Gold Encryption Service](#rose-gold-encryption-service)
- [Authentication & Authorization](#authentication--authorization)
- [Data Protection](#data-protection)
- [API Security](#api-security)
- [Audit & Compliance](#audit--compliance)
- [Best Practices](#best-practices)

## Overview

The Rose Gold Encryption system provides:

- **AES-256-GCM** encryption for stored data
- **End-to-end encryption** for API communications
- **IPFS-compatible encryption** for decentralized storage
- **JWT-based authentication** with short-lived tokens
- **Rate limiting** and IP whitelisting
- **GDPR compliance** with right to deletion

## Encryption Standards

### Supported Algorithms

| Algorithm | Use Case | Key Size |
|-----------|----------|----------|
| AES-256-GCM | NFT metadata, stored data | 256-bit |
| AES-256-GCM | Video streaming data | 256-bit |
| SHA-256 | Data hashing, integrity | 256-bit |
| HMAC-SHA256 | Message authentication | 256-bit |

### Key Management

```typescript
// Master key from environment (256-bit hex)
ROSE_GOLD_MASTER_KEY=your_64_character_hex_string_here

// Key derivation using SHA-256
const derivedKey = createHash('sha256').update(masterKey).digest();
```

## Rose Gold Encryption Service

### Initialize the Service

```typescript
import { RoseGoldEncryptionService } from './security/RoseGoldEncryption';

const encryption = new RoseGoldEncryptionService(
  process.env.ROSE_GOLD_MASTER_KEY
);
```

### Encrypt NFT Metadata

```typescript
const nftData = {
  tokenId: '123',
  owner: '0x...',
  metadata: {
    name: 'Sovereign #123',
    attributes: [...],
  },
};

const encrypted = encryption.encryptNFTMetadata(nftData);

console.log(encrypted);
// {
//   encrypted: '8a4f2e...',
//   iv: '3b2c1a...',
//   authTag: '7d6e5f...',
//   algorithm: 'aes-256-gcm'
// }
```

### Decrypt NFT Metadata

```typescript
const decrypted = encryption.decryptNFTMetadata(encrypted);

console.log(decrypted);
// Original nftData object
```

### Encrypt Streaming Data

```typescript
const videoBuffer = fs.readFileSync('video.mp4');

const encryptedStream = encryption.encryptStreamingData(videoBuffer);

// Store encrypted data
await uploadToS3(encryptedStream.encrypted);
```

### Decrypt Streaming Data

```typescript
const encryptedData = await downloadFromS3();

const decryptedBuffer = encryption.decryptStreamingData({
  encrypted: encryptedData,
  iv: storedIV,
  authTag: storedAuthTag,
  algorithm: 'aes-256-gcm',
});

// Use decrypted video buffer
```

### Secure API Channel

Create encrypted communication channels for clients:

```typescript
const channel = encryption.secureAPIChannel('client-123');

console.log(channel);
// {
//   channelId: '7a8b9c...',
//   publicKey: '2d3e4f...',
//   privateKey: '5g6h7i...',
//   createdAt: Date,
//   expiresAt: Date (15 minutes)
// }
```

### IPFS Encryption

Encrypt files before uploading to IPFS:

```typescript
const file = {
  filename: 'nft-video.mp4',
  content: videoBuffer,
  mimeType: 'video/mp4',
};

const encryptedFile = encryption.encryptForIPFS(file);

// Upload to IPFS
const ipfsHash = await ipfs.add(encryptedFile.encryptedContent);

// Store decryption key and metadata securely
await db.store({
  ipfsHash,
  decryptionKey: encryptedFile.decryptionKey,
  iv: encryptedFile.iv,
  authTag: encryptedFile.authTag,
  metadata: encryptedFile.metadata,
});
```

### Decrypt from IPFS

```typescript
const encryptedContent = await ipfs.get(ipfsHash);
const metadata = await db.getMetadata(ipfsHash);

const encryptedFile = {
  encryptedContent,
  metadata,
  decryptionKey: metadata.decryptionKey,
  iv: metadata.iv,
  authTag: metadata.authTag,
};

const decryptedBuffer = encryption.decryptFromIPFS(encryptedFile);
```

## Authentication & Authorization

### JWT Token Authentication

```typescript
import jwt from 'jsonwebtoken';

// Generate token (15-minute expiration)
const token = jwt.sign(
  {
    userId: 'user-123',
    email: 'user@example.com',
    role: 'creator',
  },
  process.env.JWT_SECRET!,
  { expiresIn: '15m' }
);

// Verify token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  console.log('Authenticated:', decoded.userId);
} catch (error) {
  console.error('Invalid token');
}
```

### Middleware Implementation

```typescript
import express from 'express';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route
app.get('/api/story-sets', authMiddleware, async (req, res) => {
  const storySets = await getStorySets(req.user.userId);
  res.json(storySets);
});
```

## Data Protection

### Hash Sensitive Data

```typescript
// Hash passwords, API keys, etc.
const hashedPassword = encryption.hashData(userPassword);

// Store hashed version only
await db.users.create({
  email: user.email,
  passwordHash: hashedPassword,
});
```

### HMAC for Data Integrity

```typescript
// Generate HMAC for data
const data = JSON.stringify(nftData);
const hmac = encryption.generateHMAC(data, secret);

// Send data with HMAC
await sendToClient({ data, hmac });

// Verify on receipt
const isValid = encryption.verifyHMAC(receivedData, receivedHMAC, secret);
if (!isValid) {
  throw new Error('Data integrity check failed');
}
```

### Encrypt with Custom Keys

For user-specific encryption:

```typescript
// Generate user-specific key
const userKey = encryption.generateSalt();

// Encrypt with user key
const encrypted = encryption.encryptWithKey(
  JSON.stringify(userData),
  userKey
);

// Store user key securely (separate from encrypted data)
await keyVault.store(userId, userKey);
```

## API Security

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 requests per minute
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

### IP Whitelisting

```typescript
const ipWhitelist = process.env.IP_WHITELIST?.split(',') || [];

const ipWhitelistMiddleware = (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (ipWhitelist.length > 0 && !ipWhitelist.includes(clientIP)) {
    return res.status(403).json({ error: 'IP not whitelisted' });
  }
  
  next();
};

// Apply to enterprise endpoints
app.use('/api/enterprise/', ipWhitelistMiddleware);
```

### API Key Authentication

```typescript
const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  const hashedKey = encryption.hashData(apiKey);
  const validKey = await db.apiKeys.findOne({ keyHash: hashedKey });
  
  if (!validKey || !validKey.active) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  req.apiKey = validKey;
  next();
};
```

### CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://scrollsoul.io',
      'https://app.scrollsoul.io',
      'http://localhost:3000',
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

## Audit & Compliance

### Audit Logging

```typescript
interface AuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  metadata?: any;
}

async function logAuditEvent(event: AuditLog) {
  // Encrypt sensitive metadata
  const encryptedMetadata = event.metadata 
    ? encryption.encryptNFTMetadata(event.metadata)
    : null;
  
  await db.auditLogs.create({
    ...event,
    metadata: encryptedMetadata,
  });
}

// Usage
await logAuditEvent({
  timestamp: new Date(),
  userId: req.user.userId,
  action: 'video_generated',
  resource: storySetId,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
  success: true,
  metadata: { provider: 'sora', duration: 60 },
});
```

### GDPR Compliance

```typescript
// Right to deletion
async function deleteUserData(userId: string) {
  // Delete story sets
  const storySets = await storyService.listStorySets(userId);
  for (const set of storySets) {
    await storyService.deleteStorySet(set.id);
  }
  
  // Delete encrypted data
  await db.encryptedData.deleteMany({ userId });
  
  // Delete audit logs
  await db.auditLogs.deleteMany({ userId });
  
  // Delete user account
  await db.users.delete({ id: userId });
  
  // Log deletion
  await logAuditEvent({
    timestamp: new Date(),
    userId,
    action: 'account_deleted',
    resource: 'user',
    ipAddress: 'system',
    userAgent: 'system',
    success: true,
  });
}
```

### Data Export

```typescript
// Right to data portability
async function exportUserData(userId: string) {
  const userData = {
    profile: await db.users.findOne({ id: userId }),
    storySets: await storyService.listStorySets(userId),
    videos: await db.videos.find({ createdBy: userId }),
    auditLogs: await db.auditLogs.find({ userId }),
  };
  
  // Decrypt encrypted fields
  if (userData.profile.encryptedData) {
    userData.profile.decryptedData = encryption.decryptNFTMetadata(
      userData.profile.encryptedData
    );
  }
  
  return userData;
}
```

## Best Practices

### 1. Key Management

- **Never hardcode keys** in source code
- **Use environment variables** for all secrets
- **Rotate keys regularly** (quarterly recommended)
- **Store master keys** in secure vault (AWS KMS, HashiCorp Vault)

### 2. Token Lifecycle

- **Short expiration** (15 minutes for access tokens)
- **Refresh tokens** for long sessions
- **Revoke on logout** immediately
- **Single-use tokens** for sensitive operations

### 3. Encryption Practices

- **Encrypt at rest** (database, file storage)
- **Encrypt in transit** (HTTPS, TLS 1.3)
- **Use authenticated encryption** (GCM mode)
- **Generate unique IVs** for each encryption

### 4. Access Control

- **Principle of least privilege**
- **Role-based access control** (RBAC)
- **Multi-factor authentication** for enterprise
- **Regular access reviews**

### 5. Monitoring

- **Log all access attempts**
- **Alert on anomalies** (unusual locations, times)
- **Monitor rate limits**
- **Track failed authentications**

### 6. Incident Response

- **Have a plan** for security breaches
- **Immediate key rotation** on compromise
- **User notification** within 72 hours (GDPR)
- **Post-incident review**

## Security Checklist

- [ ] Master encryption key generated and stored securely
- [ ] JWT secret configured and rotated
- [ ] Rate limiting enabled on all API endpoints
- [ ] IP whitelisting configured for enterprise endpoints
- [ ] CORS properly configured
- [ ] All sensitive data encrypted at rest
- [ ] HTTPS/TLS enabled on all connections
- [ ] Audit logging implemented
- [ ] GDPR compliance measures in place
- [ ] Security headers configured
- [ ] API key authentication tested
- [ ] Token expiration verified
- [ ] Incident response plan documented

## Next Steps

- Review [AI Video Integration](./AI_VIDEO_INTEGRATION.md)
- Explore [NFT Story Sets](./NFT_STORY_SETS.md)
- Check [API Reference](./API_REFERENCE.md)

---

**🔒 Rose Gold Security. Maximum Protection. Forever Sovereign. ❤️✨**
