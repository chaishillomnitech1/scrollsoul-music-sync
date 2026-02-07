/**
 * DLP Finding
 */
export interface Finding {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location?: {
    start: number;
    end: number;
  };
  value?: string;
}

/**
 * DLP Report
 */
export interface DLPReport {
  findings: Finding[];
  safe: boolean;
  scanTimestamp: number;
}

/**
 * Data Loss Prevention Service
 * Scans content for sensitive data and security issues
 */
export class DLPService {
  /**
   * Scan content for sensitive data
   */
  async scanContent(content: string): Promise<DLPReport> {
    const findings: Finding[] = [];

    // Check for credit card numbers
    if (this.detectCreditCard(content)) {
      findings.push({ type: 'CREDIT_CARD', severity: 'HIGH' });
    }

    // Check for SSN
    if (this.detectSSN(content)) {
      findings.push({ type: 'SSN', severity: 'HIGH' });
    }

    // Check for private keys
    if (this.detectPrivateKey(content)) {
      findings.push({ type: 'CRYPTO_PRIVATE_KEY', severity: 'CRITICAL' });
    }

    // Check for email addresses (PII)
    if (this.detectEmail(content)) {
      findings.push({ type: 'EMAIL_ADDRESS', severity: 'MEDIUM' });
    }

    // Check for phone numbers
    if (this.detectPhoneNumber(content)) {
      findings.push({ type: 'PHONE_NUMBER', severity: 'MEDIUM' });
    }

    // Check for API keys/tokens
    if (this.detectAPIKey(content)) {
      findings.push({ type: 'API_KEY', severity: 'HIGH' });
    }

    return {
      findings,
      safe: findings.length === 0,
      scanTimestamp: Date.now(),
    };
  }

  /**
   * Detect credit card numbers
   */
  detectCreditCard(content: string): boolean {
    // Luhn algorithm validation for credit cards
    const ccPattern = /\b\d{13,19}\b/g;
    const matches = content.match(ccPattern);
    
    if (!matches) return false;
    
    for (const match of matches) {
      if (this.luhnCheck(match)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Luhn algorithm check
   */
  private luhnCheck(num: string): boolean {
    const digits = num.split('').map(Number);
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }

  /**
   * Detect Social Security Numbers
   */
  detectSSN(content: string): boolean {
    const ssnPattern = /\b\d{3}-\d{2}-\d{4}\b/;
    return ssnPattern.test(content);
  }

  /**
   * Detect cryptocurrency private keys
   */
  detectPrivateKey(content: string): boolean {
    // 64-character hex strings (common for private keys)
    const privateKeyPattern = /\b[a-fA-F0-9]{64}\b/;
    
    // Also check for BEGIN PRIVATE KEY markers
    const pemPattern = /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/;
    
    return privateKeyPattern.test(content) || pemPattern.test(content);
  }

  /**
   * Detect email addresses
   */
  detectEmail(content: string): boolean {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    return emailPattern.test(content);
  }

  /**
   * Detect phone numbers
   */
  detectPhoneNumber(content: string): boolean {
    const phonePattern = /\b(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}\b/;
    return phonePattern.test(content);
  }

  /**
   * Detect API keys and tokens
   */
  detectAPIKey(content: string): boolean {
    // Common API key patterns
    const patterns = [
      /api[_-]?key['":\s]*[a-zA-Z0-9]{20,}/i,
      /access[_-]?token['":\s]*[a-zA-Z0-9]{20,}/i,
      /secret[_-]?key['":\s]*[a-zA-Z0-9]{20,}/i,
      /bearer\s+[a-zA-Z0-9\-._~+/]+=*/i,
    ];
    
    return patterns.some((pattern) => pattern.test(content));
  }

  /**
   * Auto-redact sensitive data
   */
  async redactPII(content: string): Promise<string> {
    let redacted = content;
    
    // Redact SSN
    redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****');
    
    // Redact credit card numbers
    redacted = redacted.replace(/\b\d{13,19}\b/g, (match) => {
      if (this.luhnCheck(match)) {
        return '****-****-****-' + match.slice(-4);
      }
      return match;
    });
    
    // Redact private keys (64-char hex)
    redacted = redacted.replace(/\b[a-fA-F0-9]{64}\b/g, '[PRIVATE_KEY_REDACTED]');
    
    // Redact PEM private keys
    redacted = redacted.replace(
      /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC )?PRIVATE KEY-----/g,
      '[PRIVATE_KEY_REDACTED]'
    );
    
    // Redact email addresses (partial)
    redacted = redacted.replace(
      /\b([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Z|a-z]{2,})\b/g,
      (match, user, domain) => {
        const redactedUser = user.charAt(0) + '***' + user.charAt(user.length - 1);
        return `${redactedUser}@${domain}`;
      }
    );
    
    return redacted;
  }

  /**
   * Sanitize input to prevent XSS and injection attacks
   */
  async sanitizeInput(input: string): Promise<string> {
    let sanitized = input;
    
    // Remove script tags
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    return sanitized;
  }

  /**
   * Check content toxicity (simplified version)
   */
  async checkToxicity(content: string): Promise<number> {
    // In production, integrate with ML model or API like Perspective API
    // This is a simplified version using keyword matching
    const toxicKeywords = [
      'hate', 'violent', 'racist', 'sexist', 'harassment',
      'threat', 'abuse', 'offensive', 'discriminatory'
    ];
    
    const lowerContent = content.toLowerCase();
    let score = 0;
    
    for (const keyword of toxicKeywords) {
      if (lowerContent.includes(keyword)) {
        score += 0.2;
      }
    }
    
    return Math.min(score, 1.0); // Cap at 1.0
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      supportedDetections: [
        'CREDIT_CARD',
        'SSN',
        'CRYPTO_PRIVATE_KEY',
        'EMAIL_ADDRESS',
        'PHONE_NUMBER',
        'API_KEY',
      ],
    };
  }
}
