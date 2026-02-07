/**
 * Moderation result
 */
export interface ModerationResult {
  approved: boolean;
  flags: string[];
  severity: 'safe' | 'warning' | 'blocked';
  nsfw: boolean;
  copyrightIssues: boolean;
  brandSafe: boolean;
  recommendations: string[];
}

/**
 * Content Moderator
 * 
 * Features:
 * - NSFW detection
 * - Copyright scanning
 * - Brand safety checks
 * - Deepfake detection
 */
export class ContentModerator {
  /**
   * Moderate content for safety and compliance
   */
  async moderateContent(content: {
    videoUrl: string;
    title: string;
    description: string;
    tags: string[];
  }): Promise<ModerationResult> {
    const flags: string[] = [];
    let severity: 'safe' | 'warning' | 'blocked' = 'safe';

    // NSFW detection
    const nsfw = await this.detectNSFW(content.videoUrl);
    if (nsfw) {
      flags.push('NSFW content detected');
      severity = 'blocked';
    }

    // Copyright scanning
    const copyrightIssues = await this.scanCopyright(content);
    if (copyrightIssues) {
      flags.push('Potential copyright issue');
      severity = severity === 'safe' ? 'warning' : severity;
    }

    // Brand safety
    const brandSafe = await this.checkBrandSafety(content);
    if (!brandSafe) {
      flags.push('Brand safety concern');
      severity = severity === 'safe' ? 'warning' : severity;
    }

    // Deepfake detection
    const isDeepfake = await this.detectDeepfake(content.videoUrl);
    if (isDeepfake) {
      flags.push('Potential synthetic media detected');
      severity = 'warning';
    }

    return {
      approved: severity !== 'blocked',
      flags,
      severity,
      nsfw,
      copyrightIssues,
      brandSafe,
      recommendations: this.generateRecommendations(flags),
    };
  }

  /**
   * Detect NSFW content
   */
  private async detectNSFW(videoUrl: string): Promise<boolean> {
    // In production: Use computer vision AI to detect NSFW
    // For now, simple URL pattern check
    const nsfwPatterns = ['adult', 'nsfw', 'explicit'];
    return nsfwPatterns.some(pattern => videoUrl.toLowerCase().includes(pattern));
  }

  /**
   * Scan for copyright issues
   */
  private async scanCopyright(content: {
    videoUrl: string;
    title: string;
    description: string;
  }): Promise<boolean> {
    // In production: Use Content ID / audio fingerprinting
    const copyrightedTerms = [
      'official music video',
      'full album',
      'unauthorized',
      'leaked',
    ];

    const allText = `${content.title} ${content.description}`.toLowerCase();
    return copyrightedTerms.some(term => allText.includes(term));
  }

  /**
   * Check brand safety
   */
  private async checkBrandSafety(content: {
    title: string;
    description: string;
    tags: string[];
  }): Promise<boolean> {
    const unsafeKeywords = [
      'scam',
      'gambling',
      'violence',
      'hate',
      'illegal',
      'drugs',
      'weapons',
    ];

    const allText = `${content.title} ${content.description} ${content.tags.join(' ')}`.toLowerCase();
    
    return !unsafeKeywords.some(keyword => allText.includes(keyword));
  }

  /**
   * Detect deepfakes / synthetic media
   */
  private async detectDeepfake(videoUrl: string): Promise<boolean> {
    // In production: Use deepfake detection AI model
    // For now, return false (assume authentic)
    return false;
  }

  /**
   * Verify NFT ownership
   */
  async verifyNFTOwnership(nftContract: string, tokenId: string, claimedOwner: string): Promise<boolean> {
    // In production: Check blockchain for actual owner
    // For now, assume verified
    console.log(`Verifying ownership of NFT ${nftContract}:${tokenId} by ${claimedOwner}`);
    return true;
  }

  /**
   * Generate moderation recommendations
   */
  private generateRecommendations(flags: string[]): string[] {
    if (flags.length === 0) {
      return ['Content approved for all platforms'];
    }

    const recommendations: string[] = [];

    if (flags.some(f => f.includes('NSFW'))) {
      recommendations.push('Do not publish - contains inappropriate content');
      recommendations.push('Review content policy guidelines');
    }

    if (flags.some(f => f.includes('copyright'))) {
      recommendations.push('Verify licensing for music and visuals');
      recommendations.push('Consider adding copyright disclaimer');
    }

    if (flags.some(f => f.includes('brand safety'))) {
      recommendations.push('Review for controversial topics');
      recommendations.push('Add content warnings if appropriate');
    }

    if (flags.some(f => f.includes('synthetic media'))) {
      recommendations.push('Add disclosure about AI-generated content');
    }

    return recommendations;
  }

  /**
   * Auto-apply age restrictions
   */
  shouldApplyAgeRestriction(moderationResult: ModerationResult): boolean {
    return moderationResult.nsfw || moderationResult.severity === 'warning';
  }

  /**
   * Generate FTC compliance disclosure
   */
  generateDisclosure(content: { sponsored: boolean; affiliate: boolean }): string {
    const disclosures: string[] = [];

    if (content.sponsored) {
      disclosures.push('This content is sponsored.');
    }

    if (content.affiliate) {
      disclosures.push('This video contains affiliate links.');
    }

    if (disclosures.length === 0) {
      return '';
    }

    return `\n\n⚠️ DISCLOSURE: ${disclosures.join(' ')}`;
  }
}
