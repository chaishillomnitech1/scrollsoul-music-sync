import { v4 as uuidv4 } from 'uuid';
import { License as ILicense, LicenseType } from '../types';

/**
 * License class for tracking music licensing
 */
export class License implements ILicense {
  id: string;
  trackId: string;
  licenseType: LicenseType;
  licensee: string;
  territory: string[];
  startDate: Date;
  endDate?: Date;
  fee: number;
  currency: string;
  terms?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'TERMINATED';
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<ILicense, 'id' | 'createdAt' | 'updatedAt'>) {
    this.id = uuidv4();
    this.trackId = data.trackId;
    this.licenseType = data.licenseType;
    this.licensee = data.licensee;
    this.territory = data.territory;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.fee = data.fee;
    this.currency = data.currency;
    this.terms = data.terms;
    this.status = data.status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Update license
   */
  update(data: Partial<Omit<ILicense, 'id' | 'createdAt'>>): void {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  /**
   * Check if license is currently active
   */
  isActive(): boolean {
    const now = new Date();
    return (
      this.status === 'ACTIVE' &&
      this.startDate <= now &&
      (!this.endDate || this.endDate >= now)
    );
  }

  /**
   * Check if license has expired
   */
  isExpired(): boolean {
    if (!this.endDate) return false;
    return new Date() > this.endDate;
  }

  /**
   * Update status based on dates
   */
  updateStatus(): void {
    if (this.isExpired() && this.status === 'ACTIVE') {
      this.status = 'EXPIRED';
      this.updatedAt = new Date();
    }
  }

  /**
   * Convert to JSON
   */
  toJSON(): ILicense {
    return {
      id: this.id,
      trackId: this.trackId,
      licenseType: this.licenseType,
      licensee: this.licensee,
      territory: this.territory,
      startDate: this.startDate,
      endDate: this.endDate,
      fee: this.fee,
      currency: this.currency,
      terms: this.terms,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
