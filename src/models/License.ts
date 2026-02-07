import { v4 as uuidv4 } from 'uuid';
import { License as ILicense, LicenseType, PublisherInfo, PROIdentifiers, CryptoWalletInfo } from '../types';

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
  // Enhanced publisher tracking
  publisher?: PublisherInfo;
  proIdentifiers?: PROIdentifiers;
  // Crypto payment support
  cryptoWallet?: CryptoWalletInfo;
  cryptoFee?: number;
  cryptoCurrency?: string;
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
    this.publisher = data.publisher;
    this.proIdentifiers = data.proIdentifiers;
    this.cryptoWallet = data.cryptoWallet;
    this.cryptoFee = data.cryptoFee;
    this.cryptoCurrency = data.cryptoCurrency;
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
   * Check if crypto payment is enabled
   */
  hasCryptoPayment(): boolean {
    return !!this.cryptoWallet && !!this.cryptoFee;
  }

  /**
   * Get total payment amount (fiat + crypto if applicable)
   */
  getTotalValue(): { fiat: number; crypto?: number; cryptoCurrency?: string } {
    return {
      fiat: this.fee,
      crypto: this.cryptoFee,
      cryptoCurrency: this.cryptoCurrency,
    };
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
      publisher: this.publisher,
      proIdentifiers: this.proIdentifiers,
      cryptoWallet: this.cryptoWallet,
      cryptoFee: this.cryptoFee,
      cryptoCurrency: this.cryptoCurrency,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
