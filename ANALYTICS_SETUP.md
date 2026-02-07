# Analytics & Performance Tracking Setup

## 📊 Overview

Comprehensive guide for setting up analytics, tracking, and performance monitoring for ScrollSoul's global deployment.

---

## Google Analytics 4 Setup

### Initial Configuration

**1. Create GA4 Property**
```
1. Go to analytics.google.com
2. Admin → Create Property
3. Property name: ScrollSoul
4. Time zone: UTC
5. Currency: USD
6. Industry: Software/Technology
```

**2. Add Data Stream**
```
Platform: Web
Website URL: https://scrollsoul.io
Stream name: ScrollSoul Production
Enhanced measurement: ON
```

**3. Install Tracking Code**

Add to `docs/index.html` (and all pages):
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'send_page_view': true,
    'anonymize_ip': true
  });
</script>
```

### Custom Events

**Trial Signup:**
```javascript
gtag('event', 'trial_signup', {
  'event_category': 'engagement',
  'event_label': 'free_trial',
  'value': 0
});
```

**Demo Request:**
```javascript
gtag('event', 'demo_request', {
  'event_category': 'engagement',
  'event_label': 'enterprise_demo',
  'value': 0
});
```

**Video Views:**
```javascript
gtag('event', 'video_view', {
  'event_category': 'engagement',
  'event_label': video_name,
  'value': watch_duration
});
```

**Pricing Calculator:**
```javascript
gtag('event', 'calculator_used', {
  'event_category': 'engagement',
  'event_label': 'roi_calculator',
  'employees': employee_count,
  'budget': budget_amount
});
```

### Goals & Conversions

**Configure Goals:**
```
Goal 1: Trial Signup
  Type: Event
  Event: trial_signup
  Value: $100 (estimated value)

Goal 2: Demo Request
  Type: Event
  Event: demo_request
  Value: $500 (estimated value)

Goal 3: Pricing Page Visit
  Type: Destination
  URL: /pricing
  Value: $0

Goal 4: Contact Form Submission
  Type: Event
  Event: form_submission
  Value: $200
```

### Audiences

**High-Intent Visitors:**
- Visited pricing page
- Watched demo video
- Used ROI calculator
- Time on site > 5 minutes

**Enterprise Prospects:**
- Viewed enterprise features
- Downloaded whitepapers
- Attended webinar
- Multiple sessions

**Developers:**
- Visited API docs
- Viewed code examples
- Clicked GitHub link
- Technical content engagement

---

## Mixpanel Setup

### Installation

**1. Create Account**
```
1. Go to mixpanel.com
2. Create project: ScrollSoul
3. Get project token
```

**2. Install SDK**
```html
<!-- Mixpanel -->
<script>
(function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);

mixpanel.init('YOUR_TOKEN', {
  debug: false,
  track_pageview: true,
  persistence: 'localStorage'
});
</script>
```

### Track User Properties

```javascript
// Identify user
mixpanel.identify(user_id);

// Set user properties
mixpanel.people.set({
  "$email": "user@company.com",
  "$name": "John Doe",
  "company": "TechCorp",
  "company_size": "1000-5000",
  "industry": "Technology",
  "signup_date": new Date().toISOString()
});
```

### Track Events

```javascript
// Page view
mixpanel.track('Page Viewed', {
  'page': 'Homepage',
  'referrer': document.referrer
});

// Trial signup
mixpanel.track('Trial Signup', {
  'plan': 'Professional',
  'source': 'Homepage CTA'
});

// Feature usage
mixpanel.track('Feature Used', {
  'feature': 'ROI Calculator',
  'result': 'savings_calculated'
});
```

### Funnels

**Trial Signup Funnel:**
```
1. Visit homepage
2. View pricing
3. Click "Start Trial"
4. Fill form
5. Complete signup
```

**Demo Request Funnel:**
```
1. Visit website
2. Click "Request Demo"
3. Fill form
4. Submit form
```

---

## Amplitude (Alternative)

**Setup:**
```html
<script type="text/javascript">
!function(){"use strict";!function(e,t){var r=e.amplitude||{_q:[],_iq:{}};if(r.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{r.invoked=!0;var n=t.createElement("script");n.type="text/javascript",n.integrity="sha384-YOUR-INTEGRITY",n.crossOrigin="anonymous",n.async=!0,n.src="https://cdn.amplitude.com/libs/amplitude-8.17.0-min.gz.js",n.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var o=t.getElementsByTagName("script")[0];o.parentNode.insertBefore(n,o);for(var i=function(){return this._q=[],this},s=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],a=0;a<s.length;a++)i.prototype[s[a]]=function(e){return function(){return this._q.push({name:e,args:Array.prototype.slice.call(arguments,0)}),this}}(s[a]);r.Identify=i;for(var u=function(){return this._q=[],this},c=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],p=0;p<c.length;p++)u.prototype[c[p]]=function(e){return function(){return this._q.push({name:e,args:Array.prototype.slice.call(arguments,0)}),this}}(c[p]);r.Revenue=u;var l=["getDeviceId","setDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport","reset"];function d(e){function t(t,r){e[t]=function(){var n={promise:new Promise((r=>{e._q.push({name:t,args:Array.prototype.slice.call(arguments,0),resolve:r})}))};if(r)return n}}for(var r=0;r<l.length;r++)t(l[r],!1);for(var n=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue","flush"],o=0;o<n.length;o++)t(n[o],!0)}d(r),r.getInstance=function(e){return e=(e&&0!==e.length?e:"$default_instance").toLowerCase(),r._iq.hasOwnProperty(e)||(r._iq[e]={_q:[]},d(r._iq[e])),r._iq[e]},e.amplitude=r}}(window,document)}();

amplitude.getInstance().init("YOUR_API_KEY");
</script>
```

---

## HubSpot CRM Integration

### Setup

**1. Install Tracking Code**
```html
<!-- HubSpot Embed Code -->
<script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/YOUR-HUBID.js"></script>
```

**2. Form Tracking**
```javascript
// HubSpot form submission
var _hsq = window._hsq = window._hsq || [];
_hsq.push(['setPath', '/pricing']);
_hsq.push(['trackPageView']);

// Track custom event
_hsq.push(['trackEvent', {
  id: 'trial_signup',
  value: 0
}]);
```

**3. Lead Scoring**
```
Demo Request: +50 points
Pricing Page View: +20 points
Blog Post Read: +5 points
Email Open: +3 points
Website Visit: +1 point
```

---

## Social Media Analytics

### Facebook Pixel

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

### LinkedIn Insight Tag

```html
<!-- LinkedIn Insight Tag -->
<script type="text/javascript">
_linkedin_partner_id = "YOUR_PARTNER_ID";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
```

### Twitter Pixel

```html
<!-- Twitter conversion tracking base code -->
<script>
!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='//static.ads-twitter.com/uwt.js',
a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
twq('init','YOUR_TWITTER_PIXEL_ID');
twq('track','PageView');
</script>
```

---

## Performance Monitoring

### Google PageSpeed Insights

**Target Metrics:**
- Performance Score: 90+
- First Contentful Paint: <1.8s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.8s
- Cumulative Layout Shift: <0.1

**Optimization:**
```
- Minify CSS/JS
- Compress images
- Use CDN
- Lazy load images
- Defer non-critical JS
- Enable browser caching
```

### Prometheus + Grafana

**Infrastructure Monitoring:**

**Install Prometheus:**
```bash
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'scrollsoul-api'
    static_configs:
      - targets: ['api.scrollsoul.io:9090']
  
  - job_name: 'scrollsoul-web'
    static_configs:
      - targets: ['scrollsoul.io:9090']
```

**Key Metrics:**
- Request rate
- Error rate
- Response time
- CPU usage
- Memory usage
- Database connections

**Grafana Dashboards:**
- API Performance
- User Analytics
- System Health
- Business Metrics

---

## Custom Dashboards

### Metrics to Track

**Acquisition:**
- Website traffic (daily, weekly, monthly)
- Traffic sources (organic, paid, referral, social)
- New visitors vs. returning
- Geographic distribution
- Device breakdown (desktop, mobile, tablet)

**Engagement:**
- Pages per session
- Average session duration
- Bounce rate
- Video views and completion rate
- Form interactions
- Search queries

**Conversion:**
- Trial signups
- Demo requests
- Contact form submissions
- Newsletter signups
- Download conversions
- Pricing page visits

**Revenue:**
- New customers
- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Average Contract Value (ACV)
- Customer Lifetime Value (LTV)
- Customer Acquisition Cost (CAC)

**Retention:**
- Customer churn rate
- Revenue churn rate
- Net Revenue Retention (NRR)
- Product usage metrics
- Support tickets
- NPS scores

---

## Reporting Schedule

### Daily Reports
- Website traffic
- Trial signups
- System uptime
- Critical errors

### Weekly Reports
- Full funnel metrics
- Campaign performance
- Top content
- Geographic trends

### Monthly Reports
- Revenue metrics
- Customer acquisition
- Churn analysis
- ROI by channel

### Quarterly Reports
- Strategic review
- Goal attainment
- Market trends
- Competitive analysis

---

## A/B Testing

### Google Optimize

**Setup:**
```html
<!-- Google Optimize -->
<script src="https://www.googleoptimize.com/optimize.js?id=OPT-XXXXXXX"></script>
```

**Test Ideas:**
1. **Hero CTA:** "Start Free Trial" vs. "Request Demo"
2. **Pricing Page:** 3 tiers vs. 4 tiers
3. **Testimonials:** Video vs. text
4. **Form Length:** Short (3 fields) vs. long (7 fields)
5. **Value Prop:** Crypto focus vs. music focus

---

## Privacy & Compliance

### GDPR Compliance

**Cookie Consent:**
```html
<!-- Cookie Consent Banner -->
<div id="cookie-consent">
  <p>We use cookies to improve your experience. <a href="/privacy">Learn more</a></p>
  <button onclick="acceptCookies()">Accept</button>
  <button onclick="rejectCookies()">Reject</button>
</div>
```

**Privacy-Friendly Analytics:**
- Anonymize IP addresses
- Disable remarketing features
- Provide opt-out mechanism
- Cookie consent management

---

## Checklist

### Setup
- [ ] Google Analytics 4 installed
- [ ] Mixpanel configured
- [ ] HubSpot CRM integrated
- [ ] Social pixels added
- [ ] Performance monitoring active
- [ ] Custom dashboards created

### Tracking
- [ ] Page views tracked
- [ ] Events configured
- [ ] Conversions tracked
- [ ] User properties set
- [ ] Funnels defined

### Compliance
- [ ] Cookie consent banner
- [ ] Privacy policy updated
- [ ] IP anonymization enabled
- [ ] Data retention configured
- [ ] GDPR compliant

---

**Remember: Data-driven decisions lead to better outcomes. Track everything, measure often, optimize continuously.**
