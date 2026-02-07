/**
 * Royalty Service
 * Business logic for royalty tracking and payment information
 */

// In-memory storage (replace with database in production)
let royalties = [
  {
    id: '1',
    trackName: 'ScrollSoul Anthem',
    placementId: '1',
    paymentType: 'Synchronization Fee',
    amount: 50000,
    currency: 'USD',
    paymentDate: '2024-01-15',
    status: 'paid',
    platform: 'Nike',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    trackName: 'Galactic Frequencies',
    placementId: '2',
    paymentType: 'Master Use Fee',
    amount: 25000,
    currency: 'USD',
    paymentDate: '2024-03-01',
    status: 'paid',
    platform: 'NCAA',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    trackName: 'ScrollSoul Anthem',
    placementId: '1',
    paymentType: 'Performance Royalty',
    amount: 15000,
    currency: 'USD',
    paymentDate: '2024-02-01',
    status: 'pending',
    platform: 'Spotify',
    createdAt: new Date().toISOString()
  }
];

class RoyaltyService {
  getAllRoyalties() {
    return royalties;
  }

  getRoyaltyById(id) {
    return royalties.find(r => r.id === id);
  }

  getTotalRoyalties() {
    return royalties.reduce((total, r) => {
      if (r.currency === 'USD') {
        return total + (r.amount || 0);
      }
      return total;
    }, 0);
  }

  getRoyaltySummary() {
    const total = this.getTotalRoyalties();
    const paid = royalties
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + (r.amount || 0), 0);
    const pending = royalties
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    return {
      totalRoyalties: total,
      paidRoyalties: paid,
      pendingRoyalties: pending,
      currency: 'USD',
      recordCount: royalties.length,
      byPlatform: this.getRoyaltiesByPlatform()
    };
  }

  getRoyaltiesByPlatform() {
    const platformSummary = {};
    royalties.forEach(r => {
      if (!platformSummary[r.platform]) {
        platformSummary[r.platform] = {
          total: 0,
          count: 0,
          paid: 0,
          pending: 0
        };
      }
      platformSummary[r.platform].total += r.amount || 0;
      platformSummary[r.platform].count += 1;
      if (r.status === 'paid') {
        platformSummary[r.platform].paid += r.amount || 0;
      } else {
        platformSummary[r.platform].pending += r.amount || 0;
      }
    });
    return platformSummary;
  }

  createRoyalty(data) {
    const royalty = {
      id: String(royalties.length + 1),
      trackName: data.trackName,
      placementId: data.placementId,
      paymentType: data.paymentType,
      amount: data.amount,
      currency: data.currency || 'USD',
      paymentDate: data.paymentDate,
      status: data.status || 'pending',
      platform: data.platform,
      createdAt: new Date().toISOString()
    };
    royalties.push(royalty);
    return royalty;
  }

  updateRoyalty(id, data) {
    const index = royalties.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    royalties[index] = {
      ...royalties[index],
      ...data,
      id: royalties[index].id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    return royalties[index];
  }
}

module.exports = new RoyaltyService();
