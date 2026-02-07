# Domain Configuration & Setup Guide

## 🌐 Custom Domain Setup

### Overview
This guide covers configuring custom domains for ScrollSoul production deployment and GitHub Pages showcase website.

---

## Production Domain Setup

### Recommended Domains
- **Primary:** scrollsoul.io
- **Alternative:** scrollsoul.com
- **Regional:** scrollsoul.eu, scrollsoul.asia

### Domain Registration

**Recommended Registrars:**
1. **Namecheap** - Affordable, reliable
2. **Google Domains** - Simple, integrated
3. **Cloudflare Registrar** - At-cost pricing
4. **GoDaddy** - Popular, feature-rich

**Annual Cost:** $10-50 per domain

### DNS Configuration

**A Records (Root Domain):**
```
Type: A
Name: @
Value: [Your server IP address]
TTL: 3600
```

**CNAME Records (Subdomains):**
```
Type: CNAME
Name: www
Value: scrollsoul.io
TTL: 3600

Type: CNAME
Name: api
Value: api.scrollsoul.io
TTL: 3600

Type: CNAME
Name: staging
Value: staging.scrollsoul.io
TTL: 3600
```

**MX Records (Email):**
```
Type: MX
Name: @
Priority: 10
Value: mail.scrollsoul.io
TTL: 3600
```

### SSL/TLS Certificates

**Option 1: Let's Encrypt (Free)**
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d scrollsoul.io -d www.scrollsoul.io

# Auto-renewal (add to crontab)
0 3 * * * certbot renew --quiet
```

**Option 2: CloudFlare (Free)**
- Enable Universal SSL in CloudFlare dashboard
- Automatic certificate management
- Edge certificate included

**Option 3: Commercial Certificate**
- DigiCert, Sectigo, GoDaddy
- Cost: $50-300/year
- Extended validation (EV) for trust

### CDN Configuration (CloudFlare)

**Setup Steps:**

1. **Add Site to CloudFlare**
   - Go to cloudflare.com
   - Click "Add a Site"
   - Enter scrollsoul.io
   - Select plan (Free or Pro)

2. **Update Nameservers**
   - CloudFlare provides nameservers (e.g., kate.ns.cloudflare.com)
   - Update at domain registrar
   - Wait for propagation (24-48 hours)

3. **Enable Features**
   - ✅ Auto HTTPS Rewrites
   - ✅ Always Use HTTPS
   - ✅ HTTP Strict Transport Security (HSTS)
   - ✅ Automatic HTTPS Rewrites
   - ✅ Opportunistic Encryption
   - ✅ TLS 1.3
   - ✅ Brotli Compression
   - ✅ Auto Minify (JS, CSS, HTML)

4. **Configure Page Rules**
   ```
   Rule 1: api.scrollsoul.io/*
   - Cache Level: Bypass
   - Security Level: Medium
   
   Rule 2: scrollsoul.io/*
   - Cache Level: Standard
   - Browser Cache TTL: 4 hours
   - Edge Cache TTL: 2 hours
   
   Rule 3: www.scrollsoul.io/*
   - Forwarding URL (301): https://scrollsoul.io/$1
   ```

5. **Enable Analytics**
   - Web Analytics (privacy-friendly)
   - Real-time dashboard
   - Traffic insights

### Email Configuration

**Option 1: Google Workspace (Recommended)**

**Setup:**
1. Go to workspace.google.com
2. Add domain: scrollsoul.io
3. Verify ownership (TXT record)
4. Configure MX records:
   ```
   Priority 1: ASPMX.L.GOOGLE.COM
   Priority 5: ALT1.ASPMX.L.GOOGLE.COM
   Priority 5: ALT2.ASPMX.L.GOOGLE.COM
   Priority 10: ALT3.ASPMX.L.GOOGLE.COM
   Priority 10: ALT4.ASPMX.L.GOOGLE.COM
   ```
5. Create email accounts:
   - hello@scrollsoul.io (general)
   - sales@scrollsoul.io (sales)
   - support@scrollsoul.io (customer support)
   - press@scrollsoul.io (media)
   - investors@scrollsoul.io (investor relations)

**Cost:** $6/user/month

**Option 2: Microsoft 365**
- Similar setup to Google Workspace
- Cost: $5-20/user/month
- Includes Office apps

**Option 3: Mailgun (Transactional)**
- For automated emails (password resets, notifications)
- Cost: $0.80/1000 emails
- API-driven

### Domain Email Setup

**SPF Record:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

**DKIM Record:**
(Provided by email provider after setup)
```
Type: TXT
Name: google._domainkey
Value: [Provided by Google Workspace]
TTL: 3600
```

**DMARC Record:**
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@scrollsoul.io
TTL: 3600
```

---

## GitHub Pages Domain Setup

### Custom Domain for Docs Site

**Recommended:** docs.scrollsoul.io or scrollsoul.io/docs

**Setup Steps:**

1. **Add CNAME File**
   ```bash
   cd docs/
   echo "docs.scrollsoul.io" > CNAME
   git add CNAME
   git commit -m "Add custom domain for GitHub Pages"
   git push
   ```

2. **Configure DNS**
   ```
   Type: CNAME
   Name: docs
   Value: chaishillomnitech1.github.io
   TTL: 3600
   ```

3. **Enable HTTPS in GitHub**
   - Go to repository Settings
   - Pages section
   - Check "Enforce HTTPS"

4. **Verify Setup**
   - Visit https://docs.scrollsoul.io
   - Should redirect to HTTPS automatically
   - Check SSL certificate

### Alternative: Root Domain

**If using scrollsoul.io for GitHub Pages:**

1. **Create CNAME file:**
   ```bash
   echo "scrollsoul.io" > docs/CNAME
   ```

2. **Configure DNS A Records:**
   ```
   Type: A
   Name: @
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   ```

3. **Add www redirect:**
   ```
   Type: CNAME
   Name: www
   Value: chaishillomnitech1.github.io
   ```

---

## Subdomain Strategy

### Production Subdomains

**Core Services:**
- `scrollsoul.io` - Main marketing site
- `app.scrollsoul.io` - Platform application
- `api.scrollsoul.io` - API endpoints
- `docs.scrollsoul.io` - Documentation
- `status.scrollsoul.io` - Status page

**Environments:**
- `staging.scrollsoul.io` - Staging environment
- `dev.scrollsoul.io` - Development environment
- `demo.scrollsoul.io` - Demo environment

**Marketing:**
- `blog.scrollsoul.io` - Blog (optional)
- `press.scrollsoul.io` - Press kit
- `investors.scrollsoul.io` - Investor portal

**Support:**
- `support.scrollsoul.io` - Help center
- `community.scrollsoul.io` - Community forum

---

## Brand Assets Hosting

### Logo Delivery

**CDN Hosting (Recommended):**
```
https://cdn.scrollsoul.io/brand/logo-full-color.svg
https://cdn.scrollsoul.io/brand/logo-white.svg
https://cdn.scrollsoul.io/brand/logo-icon.svg
```

**File Structure:**
```
/brand/
  /logos/
    - logo-full-color.svg
    - logo-full-color.png (1000x1000)
    - logo-white.svg
    - logo-white.png
    - logo-monochrome.svg
    - icon-only.svg
  /colors/
    - palette.json
  /fonts/
    - Inter-Regular.woff2
    - Inter-Bold.woff2
  /guidelines/
    - brand-guidelines.pdf
```

---

## Monitoring & Uptime

### Domain Monitoring

**Tools:**
- **UptimeRobot** (Free/Paid)
  - Monitor: scrollsoul.io, api.scrollsoul.io
  - Interval: 5 minutes
  - Alerts: Email, SMS, Slack

- **Pingdom** (Paid)
  - Advanced monitoring
  - Performance insights
  - Real user monitoring

### DNS Monitoring

**DNSPerf:**
- Monitor DNS resolution times
- Global latency testing
- Provider comparison

**Alerts:**
- DNS propagation delays
- DNSSEC issues
- SSL certificate expiration
- Domain expiration

---

## SSL/TLS Best Practices

### Configuration

**Minimum TLS Version:** TLS 1.2
**Recommended:** TLS 1.3

**Cipher Suites (Strong):**
```
TLS_AES_128_GCM_SHA256
TLS_AES_256_GCM_SHA384
TLS_CHACHA20_POLY1305_SHA256
ECDHE-ECDSA-AES128-GCM-SHA256
ECDHE-RSA-AES128-GCM-SHA256
ECDHE-ECDSA-AES256-GCM-SHA384
ECDHE-RSA-AES256-GCM-SHA384
```

**HSTS Header:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Certificate Renewal:**
- Auto-renewal 30 days before expiration
- Monitoring alerts
- Fallback certificate

---

## Security Headers

**Recommended Headers:**

```nginx
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.scrollsoul.io; style-src 'self' 'unsafe-inline';" always;

# CORS (for API)
add_header Access-Control-Allow-Origin "*" always;
add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
```

---

## Checklist

### Pre-Launch
- [ ] Domain registered
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] Email setup and tested
- [ ] CDN enabled
- [ ] Monitoring configured
- [ ] Backup MX records
- [ ] Domain auto-renewal enabled

### Post-Launch
- [ ] SSL grade A+ (check: ssllabs.com)
- [ ] DNS propagated globally
- [ ] Email deliverability tested
- [ ] All subdomains working
- [ ] Monitoring alerts tested
- [ ] Performance benchmarks met
- [ ] Security headers verified

---

## Troubleshooting

### Common Issues

**Issue:** Domain not resolving
**Solution:** Check DNS propagation (use: whatsmydns.net)

**Issue:** SSL certificate errors
**Solution:** Verify certificate chain, check renewal status

**Issue:** Email not delivering
**Solution:** Verify SPF, DKIM, DMARC records

**Issue:** Slow page load
**Solution:** Enable CDN, check caching headers

**Issue:** Mixed content warnings
**Solution:** Ensure all resources use HTTPS

---

## Support Resources

**Domain Registration:**
- Namecheap Support: namecheap.com/support
- Google Domains: support.google.com/domains

**CDN:**
- CloudFlare Docs: developers.cloudflare.com
- CloudFlare Support: support.cloudflare.com

**Email:**
- Google Workspace: support.google.com/a
- Microsoft 365: support.microsoft.com

**SSL:**
- Let's Encrypt: letsencrypt.org/docs
- SSL Labs Testing: ssllabs.com/ssltest

---

**Note:** Always test configuration changes in staging environment before applying to production.
