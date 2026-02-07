/**
 * License Service
 * Business logic for music license tracking
 */

// In-memory storage (replace with database in production)
let licenses = [
  {
    id: '1',
    trackName: 'ScrollSoul Anthem',
    licenseType: 'Synchronization',
    licensee: 'Nike Inc.',
    territory: 'Worldwide',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    fee: 50000,
    currency: 'USD',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    trackName: 'Galactic Frequencies',
    licenseType: 'Master Use',
    licensee: 'NCAA',
    territory: 'USA',
    startDate: '2024-03-01',
    endDate: '2024-04-30',
    fee: 25000,
    currency: 'USD',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

class LicenseService {
  getAllLicenses() {
    return licenses;
  }

  getLicenseById(id) {
    return licenses.find(l => l.id === id);
  }

  createLicense(data) {
    const license = {
      id: String(licenses.length + 1),
      trackName: data.trackName,
      licenseType: data.licenseType,
      licensee: data.licensee,
      territory: data.territory || 'Worldwide',
      startDate: data.startDate,
      endDate: data.endDate,
      fee: data.fee,
      currency: data.currency || 'USD',
      status: data.status || 'pending',
      createdAt: new Date().toISOString()
    };
    licenses.push(license);
    return license;
  }

  updateLicense(id, data) {
    const index = licenses.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    licenses[index] = {
      ...licenses[index],
      ...data,
      id: licenses[index].id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    return licenses[index];
  }

  deleteLicense(id) {
    const index = licenses.findIndex(l => l.id === id);
    if (index === -1) return false;
    
    licenses.splice(index, 1);
    return true;
  }
}

module.exports = new LicenseService();
