import { License } from '../models/License';
import { License as ILicense } from '../types';

/**
 * LicenseService handles licensing and placement monitoring
 */
export class LicenseService {
  private licenses: Map<string, License> = new Map();

  /**
   * Create a new license
   */
  createLicense(data: Omit<ILicense, 'id' | 'createdAt' | 'updatedAt'>): License {
    const license = new License(data);
    this.licenses.set(license.id, license);
    return license;
  }

  /**
   * Get license by ID
   */
  getLicense(id: string): License | undefined {
    return this.licenses.get(id);
  }

  /**
   * Get all licenses
   */
  getAllLicenses(): License[] {
    return Array.from(this.licenses.values());
  }

  /**
   * Get licenses for a track
   */
  getLicensesByTrack(trackId: string): License[] {
    return Array.from(this.licenses.values()).filter((license) => license.trackId === trackId);
  }

  /**
   * Get active licenses
   */
  getActiveLicenses(): License[] {
    return Array.from(this.licenses.values()).filter((license) => license.isActive());
  }

  /**
   * Get licenses by licensee
   */
  getLicensesByLicensee(licensee: string): License[] {
    return Array.from(this.licenses.values()).filter(
      (license) => license.licensee.toLowerCase().includes(licensee.toLowerCase())
    );
  }

  /**
   * Update license
   */
  updateLicense(id: string, data: Partial<Omit<ILicense, 'id' | 'createdAt'>>): License {
    const license = this.licenses.get(id);
    if (!license) {
      throw new Error(`License not found: ${id}`);
    }

    license.update(data);
    return license;
  }

  /**
   * Update all license statuses
   */
  updateAllStatuses(): void {
    Array.from(this.licenses.values()).forEach((license) => {
      license.updateStatus();
    });
  }

  /**
   * Delete license
   */
  deleteLicense(id: string): boolean {
    return this.licenses.delete(id);
  }

  /**
   * Get total licensing revenue
   */
  getTotalRevenue(currency: string = 'USD'): number {
    return Array.from(this.licenses.values())
      .filter((license) => license.currency === currency)
      .reduce((total, license) => total + license.fee, 0);
  }

  /**
   * Get licensing stats
   */
  getStats(): {
    total: number;
    active: number;
    expired: number;
    pending: number;
    terminated: number;
  } {
    const all = Array.from(this.licenses.values());
    return {
      total: all.length,
      active: all.filter((l) => l.status === 'ACTIVE').length,
      expired: all.filter((l) => l.status === 'EXPIRED').length,
      pending: all.filter((l) => l.status === 'PENDING').length,
      terminated: all.filter((l) => l.status === 'TERMINATED').length,
    };
  }
}
