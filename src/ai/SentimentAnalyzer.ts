/**
 * Comment sentiment
 */
export interface CommentSentiment {
  text: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
  emotions: string[];
}

/**
 * Emoji analysis result
 */
export interface EmojiAnalysis {
  emoji: string;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

/**
 * Content risk assessment
 */
export interface RiskAssessment {
  isControversial: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  concerns: string[];
  recommendations: string[];
}

/**
 * Sentiment Analysis Engine
 * 
 * Features:
 * - Comment analysis to understand audience feedback
 * - Emoji interpretation to gauge emotional reactions
 * - Controversy detection to flag risky content
 * - Praise extraction for testimonials
 */
export class SentimentAnalyzer {
  /**
   * Analyze comment sentiment
   */
  analyzeComment(comment: string): CommentSentiment {
    const lowerComment = comment.toLowerCase();
    
    // Simple keyword-based sentiment (in production: use NLP model)
    const positiveKeywords = ['love', 'amazing', 'great', 'awesome', 'fantastic', 'incredible'];
    const negativeKeywords = ['hate', 'terrible', 'awful', 'bad', 'disappointing', 'scam'];
    
    let score = 0;
    const emotions: string[] = [];

    // Count positive/negative keywords
    positiveKeywords.forEach(keyword => {
      if (lowerComment.includes(keyword)) {
        score += 0.3;
        emotions.push('excitement');
      }
    });

    negativeKeywords.forEach(keyword => {
      if (lowerComment.includes(keyword)) {
        score -= 0.3;
        emotions.push('disappointment');
      }
    });

    // Normalize score
    score = Math.max(-1, Math.min(1, score));

    return {
      text: comment,
      sentiment: score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral',
      score,
      emotions: [...new Set(emotions)],
    };
  }

  /**
   * Analyze batch of comments
   */
  analyzeBatch(comments: string[]): {
    overall: 'positive' | 'neutral' | 'negative';
    avgScore: number;
    breakdown: { positive: number; neutral: number; negative: number };
  } {
    const results = comments.map(c => this.analyzeComment(c));
    
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    
    const breakdown = {
      positive: results.filter(r => r.sentiment === 'positive').length,
      neutral: results.filter(r => r.sentiment === 'neutral').length,
      negative: results.filter(r => r.sentiment === 'negative').length,
    };

    return {
      overall: avgScore > 0.2 ? 'positive' : avgScore < -0.2 ? 'negative' : 'neutral',
      avgScore,
      breakdown,
    };
  }

  /**
   * Interpret emoji reactions
   */
  analyzeEmojis(emojis: string[]): EmojiAnalysis[] {
    const emojiCounts = new Map<string, number>();
    
    emojis.forEach(emoji => {
      emojiCounts.set(emoji, (emojiCounts.get(emoji) || 0) + 1);
    });

    const positiveEmojis = ['😍', '🔥', '❤️', '👍', '🎉', '✨', '💯', '🚀'];
    const negativeEmojis = ['😢', '😡', '👎', '💔', '😞'];

    return Array.from(emojiCounts.entries()).map(([emoji, count]) => ({
      emoji,
      count,
      sentiment: positiveEmojis.includes(emoji) ? 'positive' :
                negativeEmojis.includes(emoji) ? 'negative' : 'neutral',
    }));
  }

  /**
   * Detect controversial content
   */
  detectControversy(content: {
    title: string;
    description: string;
    comments: string[];
  }): RiskAssessment {
    const controversialTopics = [
      'politics', 'religion', 'gambling', 'violence', 'drugs',
      'scam', 'fraud', 'illegal',
    ];

    const allText = `${content.title} ${content.description} ${content.comments.join(' ')}`.toLowerCase();
    const concerns: string[] = [];

    controversialTopics.forEach(topic => {
      if (allText.includes(topic)) {
        concerns.push(`Contains reference to: ${topic}`);
      }
    });

    const riskLevel: 'low' | 'medium' | 'high' = 
      concerns.length === 0 ? 'low' :
      concerns.length <= 2 ? 'medium' : 'high';

    return {
      isControversial: concerns.length > 0,
      riskLevel,
      concerns,
      recommendations: this.generateRecommendations(concerns),
    };
  }

  /**
   * Extract positive testimonials
   */
  extractTestimonials(comments: string[], minScore: number = 0.5): string[] {
    return comments
      .map(comment => ({
        text: comment,
        analysis: this.analyzeComment(comment),
      }))
      .filter(({ analysis }) => analysis.score >= minScore)
      .sort((a, b) => b.analysis.score - a.analysis.score)
      .slice(0, 10)
      .map(({ text }) => text);
  }

  /**
   * Generate safety recommendations
   */
  private generateRecommendations(concerns: string[]): string[] {
    if (concerns.length === 0) {
      return ['Content appears safe for all audiences'];
    }

    const recommendations: string[] = [
      'Review content for platform compliance',
      'Consider age restrictions if applicable',
      'Monitor comments closely',
    ];

    if (concerns.some(c => c.includes('scam') || c.includes('fraud'))) {
      recommendations.push('Add disclaimers about investment risks');
    }

    return recommendations;
  }

  /**
   * Calculate engagement quality
   */
  calculateEngagementQuality(metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  }): {
    qualityScore: number; // 0-100
    engagementRate: number;
    viralityPotential: number;
  } {
    const engagementRate = ((metrics.likes + metrics.comments + metrics.shares) / metrics.views) * 100;
    
    // Weight different engagement types
    const qualityScore = Math.min(100, 
      (metrics.comments * 3 + metrics.shares * 5 + metrics.likes) / (metrics.views / 100)
    );

    const viralityPotential = Math.min(100, metrics.shares / metrics.views * 1000);

    return {
      qualityScore,
      engagementRate,
      viralityPotential,
    };
  }
}
