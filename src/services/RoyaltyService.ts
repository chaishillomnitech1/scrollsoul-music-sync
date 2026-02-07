import { Royalty } from '../models/Royalty';
import { Royalty as IRoyalty } from '../types';

/**
 * RoyaltyService handles royalty automation and distribution
 */
export class RoyaltyService {
  private royalties: Map<string, Royalty> = new Map();

  /**
   * Create a new royalty
   */
  createRoyalty(data: Omit<IRoyalty, 'id' | 'createdAt' | 'updatedAt'>): Royalty {
    const royalty = new Royalty(data);
    this.royalties.set(royalty.id, royalty);
    return royalty;
  }

  /**
   * Get royalty by ID
   */
  getRoyalty(id: string): Royalty | undefined {
    return this.royalties.get(id);
  }

  /**
   * Get all royalties
   */
  getAllRoyalties(): Royalty[] {
    return Array.from(this.royalties.values());
  }

  /**
   * Get royalties by track
   */
  getRoyaltiesByTrack(trackId: string): Royalty[] {
    return Array.from(this.royalties.values()).filter((royalty) => royalty.trackId === trackId);
  }

  /**
   * Get royalties by payee
   */
  getRoyaltiesByPayee(payee: string): Royalty[] {
    return Array.from(this.royalties.values()).filter(
      (royalty) => royalty.payee.toLowerCase().includes(payee.toLowerCase())
    );
  }

  /**
   * Get royalties by status
   */
  getRoyaltiesByStatus(
    status: 'PENDING' | 'CALCULATED' | 'PAID' | 'DISPUTED'
  ): Royalty[] {
    return Array.from(this.royalties.values()).filter((royalty) => royalty.status === status);
  }

  /**
   * Update royalty
   */
  updateRoyalty(id: string, data: Partial<Omit<IRoyalty, 'id' | 'createdAt'>>): Royalty {
    const royalty = this.royalties.get(id);
    if (!royalty) {
      throw new Error(`Royalty not found: ${id}`);
    }

    royalty.update(data);
    return royalty;
  }

  /**
   * Process royalty payment
   */
  processPayment(id: string, paymentReference?: string): Royalty {
    const royalty = this.royalties.get(id);
    if (!royalty) {
      throw new Error(`Royalty not found: ${id}`);
    }

    if (royalty.status !== 'CALCULATED') {
      throw new Error(`Royalty must be in CALCULATED status to process payment`);
    }

    royalty.markAsPaid(paymentReference);
    return royalty;
  }

  /**
   * Batch process payments
   */
  batchProcessPayments(royaltyIds: string[]): { success: string[]; failed: string[] } {
    const success: string[] = [];
    const failed: string[] = [];

    royaltyIds.forEach((id) => {
      try {
        this.processPayment(id);
        success.push(id);
      } catch (error) {
        failed.push(id);
      }
    });

    return { success, failed };
  }

  /**
   * Calculate total unpaid royalties
   */
  getTotalUnpaid(currency: string = 'USD'): number {
    return Array.from(this.royalties.values())
      .filter((royalty) => royalty.status !== 'PAID' && royalty.currency === currency)
      .reduce((total, royalty) => total + royalty.amount, 0);
  }

  /**
   * Calculate total paid royalties
   */
  getTotalPaid(currency: string = 'USD'): number {
    return Array.from(this.royalties.values())
      .filter((royalty) => royalty.status === 'PAID' && royalty.currency === currency)
      .reduce((total, royalty) => total + royalty.amount, 0);
  }

  /**
   * Get royalty distribution by payee type
   */
  getDistributionByPayeeType(): Map<string, number> {
    const distribution = new Map<string, number>();

    Array.from(this.royalties.values()).forEach((royalty) => {
      const current = distribution.get(royalty.payeeType) || 0;
      distribution.set(royalty.payeeType, current + royalty.amount);
    });

    return distribution;
  }

  /**
   * Delete royalty
   */
  deleteRoyalty(id: string): boolean {
    return this.royalties.delete(id);
  }

  /**
   * Get royalty stats
   */
  getStats(): {
    total: number;
    pending: number;
    calculated: number;
    paid: number;
    disputed: number;
  } {
    const all = Array.from(this.royalties.values());
    return {
      total: all.length,
      pending: all.filter((r) => r.status === 'PENDING').length,
      calculated: all.filter((r) => r.status === 'CALCULATED').length,
      paid: all.filter((r) => r.status === 'PAID').length,
      disputed: all.filter((r) => r.status === 'DISPUTED').length,
    };
  }
}
