import { v4 as uuidv4 } from 'uuid';

/**
 * A/B test variant
 */
export interface Variant {
  id: string;
  value: string;
  traffic: number; // Percentage 0-100
  performance?: {
    views: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
}

/**
 * A/B test configuration
 */
export interface ABTest {
  id: string;
  variable: 'thumbnail' | 'title' | 'description' | 'hashtags' | 'post-time';
  variants: Variant[];
  trafficSplit: number[];
  successMetric: 'views' | 'engagement' | 'conversions' | 'watch-time';
  duration: number; // hours
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'paused';
  winner?: string;
  autoApplyWinner: boolean;
}

/**
 * Automated A/B Testing Service
 * 
 * Features:
 * - Test title, thumbnail, description, hashtags, posting time
 * - Traffic splitting
 * - Auto-select winner based on success metric
 * - Apply winning variant automatically
 */
export class ABTestService {
  private tests: Map<string, ABTest> = new Map();

  /**
   * Create new A/B test
   */
  createTest(config: {
    variable: ABTest['variable'];
    variants: Array<{ value: string; traffic: number }>;
    successMetric: ABTest['successMetric'];
    duration: number;
    autoApplyWinner?: boolean;
  }): string {
    const testId = uuidv4();

    const variants: Variant[] = config.variants.map(v => ({
      id: uuidv4(),
      value: v.value,
      traffic: v.traffic,
    }));

    const test: ABTest = {
      id: testId,
      variable: config.variable,
      variants,
      trafficSplit: config.variants.map(v => v.traffic),
      successMetric: config.successMetric,
      duration: config.duration,
      startTime: new Date(),
      status: 'running',
      autoApplyWinner: config.autoApplyWinner ?? true,
    };

    this.tests.set(testId, test);
    this.scheduleTestCompletion(testId, config.duration);

    return testId;
  }

  /**
   * Record variant performance
   */
  recordPerformance(
    testId: string,
    variantId: string,
    metrics: {
      views?: number;
      clicks?: number;
      conversions?: number;
    }
  ): void {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (!variant) return;

    if (!variant.performance) {
      variant.performance = {
        views: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
      };
    }

    if (metrics.views) variant.performance.views += metrics.views;
    if (metrics.clicks) variant.performance.clicks += metrics.clicks;
    if (metrics.conversions) variant.performance.conversions += metrics.conversions;

    // Calculate CTR
    if (variant.performance.views > 0) {
      variant.performance.ctr = (variant.performance.clicks / variant.performance.views) * 100;
    }
  }

  /**
   * Get test results
   */
  getTestResults(testId: string): ABTest | undefined {
    return this.tests.get(testId);
  }

  /**
   * Determine test winner
   */
  determineWinner(testId: string): Variant | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    // Filter variants with performance data
    const withPerformance = test.variants.filter(v => v.performance);
    if (withPerformance.length === 0) return null;

    // Sort by success metric
    const sorted = withPerformance.sort((a, b) => {
      const aMetric = this.getMetricValue(a, test.successMetric);
      const bMetric = this.getMetricValue(b, test.successMetric);
      return bMetric - aMetric;
    });

    return sorted[0];
  }

  /**
   * Complete test and apply winner
   */
  completeTest(testId: string): { winner: Variant; improvement: number } | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    test.status = 'completed';
    test.endTime = new Date();

    const winner = this.determineWinner(testId);
    if (!winner) return null;

    test.winner = winner.id;

    // Calculate improvement
    const improvement = this.calculateImprovement(test);

    if (test.autoApplyWinner) {
      this.applyWinner(test, winner);
    }

    return { winner, improvement };
  }

  /**
   * Pause test
   */
  pauseTest(testId: string): boolean {
    const test = this.tests.get(testId);
    if (!test) return false;

    test.status = 'paused';
    return true;
  }

  /**
   * Resume test
   */
  resumeTest(testId: string): boolean {
    const test = this.tests.get(testId);
    if (!test) return false;

    test.status = 'running';
    return true;
  }

  /**
   * Get all active tests
   */
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(t => t.status === 'running');
  }

  /**
   * Select variant for user based on traffic split
   */
  selectVariant(testId: string): Variant | null {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'running') return null;

    const random = Math.random() * 100;
    let cumulative = 0;

    for (const variant of test.variants) {
      cumulative += variant.traffic;
      if (random <= cumulative) {
        return variant;
      }
    }

    return test.variants[0];
  }

  // Private helper methods

  private scheduleTestCompletion(testId: string, durationHours: number): void {
    setTimeout(() => {
      this.completeTest(testId);
    }, durationHours * 60 * 60 * 1000);
  }

  private getMetricValue(variant: Variant, metric: ABTest['successMetric']): number {
    if (!variant.performance) return 0;

    switch (metric) {
      case 'views':
        return variant.performance.views;
      case 'engagement':
        return variant.performance.clicks + variant.performance.conversions;
      case 'conversions':
        return variant.performance.conversions;
      case 'watch-time':
        return variant.performance.views * 0.6; // Estimate
      default:
        return 0;
    }
  }

  private calculateImprovement(test: ABTest): number {
    const variants = test.variants.filter(v => v.performance);
    if (variants.length < 2) return 0;

    const winner = variants.reduce((best, current) => {
      const bestMetric = this.getMetricValue(best, test.successMetric);
      const currentMetric = this.getMetricValue(current, test.successMetric);
      return currentMetric > bestMetric ? current : best;
    });

    const baseline = variants.find(v => v.id !== winner.id);
    if (!baseline) return 0;

    const winnerMetric = this.getMetricValue(winner, test.successMetric);
    const baselineMetric = this.getMetricValue(baseline, test.successMetric);

    if (baselineMetric === 0) return 0;

    return ((winnerMetric - baselineMetric) / baselineMetric) * 100;
  }

  private applyWinner(test: ABTest, winner: Variant): void {
    // In production: Update default settings to use winning variant
    console.log(`Applying winner for ${test.variable}: ${winner.value}`);
  }
}
