import { v4 as uuidv4 } from 'uuid';
import { Royalty as IRoyalty } from '../types';

/**
 * Royalty class for tracking and automating royalty payments
 */
export class Royalty implements IRoyalty {
  id: string;
  trackId: string;
  placementId?: string;
  amount: number;
  currency: string;
  payee: string;
  payeeType: 'ARTIST' | 'WRITER' | 'PUBLISHER' | 'LABEL' | 'OTHER';
  percentage?: number;
  periodStart: Date;
  periodEnd: Date;
  status: 'PENDING' | 'CALCULATED' | 'PAID' | 'DISPUTED';
  paidDate?: Date;
  paymentReference?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<IRoyalty, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = uuidv4();
    this.trackId = data.trackId;
    this.placementId = data.placementId;
    this.amount = data.amount;
    this.currency = data.currency;
    this.payee = data.payee;
    this.payeeType = data.payeeType;
    this.percentage = data.percentage;
    this.periodStart = data.periodStart;
    this.periodEnd = data.periodEnd;
    this.status = data.status;
    this.paidDate = data.paidDate;
    this.paymentReference = data.paymentReference;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Update royalty
   */
  update(data: Partial<Omit<IRoyalty, 'id' | 'createdAt'>>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  /**
   * Mark royalty as calculated
   */
  markAsCalculated(): void {
    this.status = 'CALCULATED';
    this.updatedAt = new Date();
  }

  /**
   * Mark royalty as paid
   */
  markAsPaid(paymentReference?: string): void {
    this.status = 'PAID';
    this.paidDate = new Date();
    if (paymentReference) {
      this.paymentReference = paymentReference;
    }
    this.updatedAt = new Date();
  }

  /**
   * Mark royalty as disputed
   */
  markAsDisputed(): void {
    this.status = 'DISPUTED';
    this.updatedAt = new Date();
  }

  /**
   * Calculate amount based on percentage and base amount
   */
  calculateFromPercentage(baseAmount: number): void {
    if (this.percentage) {
      this.amount = baseAmount * (this.percentage / 100);
      this.updatedAt = new Date();
    }
  }

  /**
   * Convert to JSON
   */
  toJSON(): IRoyalty {
    return {
      id: this.id,
      trackId: this.trackId,
      placementId: this.placementId,
      amount: this.amount,
      currency: this.currency,
      payee: this.payee,
      payeeType: this.payeeType,
      percentage: this.percentage,
      periodStart: this.periodStart,
      periodEnd: this.periodEnd,
      status: this.status,
      paidDate: this.paidDate,
      paymentReference: this.paymentReference,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
