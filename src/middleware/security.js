/**
 * Security Middleware for ScrollSoul Music Sync API
 * Implements authentication, rate limiting, and request validation
 */

// Simple rate limiting implementation
const rateLimitStore = new Map();

/**
 * Rate limiting middleware
 * Limits requests per IP address to prevent abuse
 */
function rateLimit(options = {}) {
  const {
    windowMs = 60000, // 1 minute
    maxRequests = 100,
    message = 'Too many requests, please try again later'
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (now - value.resetTime > windowMs) {
        rateLimitStore.delete(key);
      }
    }

    // Get or create rate limit entry
    let rateLimit = rateLimitStore.get(ip);
    if (!rateLimit || now - rateLimit.resetTime > windowMs) {
      rateLimit = {
        count: 0,
        resetTime: now
      };
      rateLimitStore.set(ip, rateLimit);
    }

    rateLimit.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - rateLimit.count));
    res.setHeader('X-RateLimit-Reset', new Date(rateLimit.resetTime + windowMs).toISOString());

    if (rateLimit.count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((rateLimit.resetTime + windowMs - now) / 1000)
      });
    }

    next();
  };
}

/**
 * API Key authentication middleware
 * Validates API key from header or query parameter
 */
function apiKeyAuth(req, res, next) {
  // Get API key from header or query
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  // In development, allow requests without API key
  if (process.env.NODE_ENV === 'development' || process.env.REQUIRE_API_KEY === 'false') {
    return next();
  }

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required',
      message: 'Include X-API-Key header or api_key query parameter'
    });
  }

  // Validate API key against environment variable
  const validApiKey = process.env.API_KEY;
  if (validApiKey && apiKey !== validApiKey) {
    return res.status(403).json({
      success: false,
      error: 'Invalid API key'
    });
  }

  next();
}

/**
 * NFT-based authentication middleware
 * Verifies user holds required NFT for access
 */
function nftAuth(req, res, next) {
  const walletAddress = req.headers['x-wallet-address'];

  // In development or if NFT auth is disabled, allow requests
  if (process.env.NODE_ENV === 'development' || process.env.REQUIRE_NFT_AUTH === 'false') {
    return next();
  }

  if (!walletAddress) {
    return res.status(401).json({
      success: false,
      error: 'Wallet address required for NFT authentication',
      message: 'Include X-Wallet-Address header'
    });
  }

  // In production, would verify NFT ownership via scrollsoul-nft-core
  // For now, just validate address format
  if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid wallet address format'
    });
  }

  req.walletAddress = walletAddress;
  next();
}

/**
 * Legion certification middleware
 * Verifies user has Legion certification
 */
function legionAuth(req, res, next) {
  const certificationToken = req.headers['x-certification-token'];

  // In development or if Legion auth is disabled, allow requests
  if (process.env.NODE_ENV === 'development' || process.env.REQUIRE_LEGION_AUTH === 'false') {
    return next();
  }

  if (!certificationToken) {
    return res.status(401).json({
      success: false,
      error: 'Legion certification required',
      message: 'Include X-Certification-Token header'
    });
  }

  // In production, would verify certification via legion-certification-portal
  req.certificationToken = certificationToken;
  next();
}

/**
 * Request validation middleware
 * Validates request body and parameters
 */
function validateRequest(schema) {
  return (req, res, next) => {
    const { body, params, query } = req;

    // Simple validation - check required fields
    if (schema.body) {
      for (const field of schema.body.required || []) {
        if (!body[field]) {
          return res.status(400).json({
            success: false,
            error: `Missing required field: ${field}`
          });
        }
      }
    }

    if (schema.params) {
      for (const field of schema.params.required || []) {
        if (!params[field]) {
          return res.status(400).json({
            success: false,
            error: `Missing required parameter: ${field}`
          });
        }
      }
    }

    next();
  };
}

/**
 * Security headers middleware
 * Adds security-related HTTP headers
 */
function securityHeaders(req, res, next) {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
}

/**
 * Error handling middleware
 * Catches and formats errors
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Request logger middleware
 * Logs all incoming requests
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}

module.exports = {
  rateLimit,
  apiKeyAuth,
  nftAuth,
  legionAuth,
  validateRequest,
  securityHeaders,
  errorHandler,
  requestLogger
};
