/**
 * Platform Service
 * Business logic for platform integrations (Spotify, Vydia, NCAA, Nike, etc.)
 */

// Platform configuration and status
const platforms = {
  spotify: {
    name: 'Spotify',
    type: 'streaming',
    status: 'connected',
    apiEndpoint: 'https://api.spotify.com/v1',
    syncEnabled: true,
    lastSync: new Date().toISOString(),
    tracksCount: 25
  },
  vydia: {
    name: 'Vydia',
    type: 'distribution',
    status: 'connected',
    apiEndpoint: 'https://api.vydia.com',
    syncEnabled: true,
    lastSync: new Date().toISOString(),
    distributionChannels: ['YouTube', 'Apple Music', 'Spotify']
  },
  ncaa: {
    name: 'NCAA',
    type: 'licensing',
    status: 'connected',
    apiEndpoint: 'https://ncaa.api.example.com',
    syncEnabled: true,
    lastSync: new Date().toISOString(),
    activeCampaigns: 2
  },
  nike: {
    name: 'Nike',
    type: 'advertising',
    status: 'connected',
    apiEndpoint: 'https://nike.brand.api.example.com',
    syncEnabled: true,
    lastSync: new Date().toISOString(),
    activePlacements: 3
  }
};

class PlatformService {
  getAllPlatforms() {
    return Object.keys(platforms).map(key => ({
      id: key,
      ...platforms[key]
    }));
  }

  getPlatformStatus() {
    const status = {
      totalPlatforms: Object.keys(platforms).length,
      connectedPlatforms: 0,
      disconnectedPlatforms: 0,
      platforms: {}
    };

    Object.keys(platforms).forEach(key => {
      const platform = platforms[key];
      status.platforms[key] = {
        name: platform.name,
        status: platform.status,
        syncEnabled: platform.syncEnabled,
        lastSync: platform.lastSync
      };
      if (platform.status === 'connected') {
        status.connectedPlatforms++;
      } else {
        status.disconnectedPlatforms++;
      }
    });

    return status;
  }

  getPlatformData(platformId) {
    const platform = platforms[platformId.toLowerCase()];
    if (!platform) return null;

    return {
      id: platformId,
      ...platform,
      syncHistory: this.getSyncHistory(platformId)
    };
  }

  syncWithPlatform(platformId) {
    const platform = platforms[platformId.toLowerCase()];
    if (!platform) {
      throw new Error('Platform not found');
    }

    if (platform.status !== 'connected') {
      throw new Error('Platform is not connected');
    }

    // Simulate sync operation
    platform.lastSync = new Date().toISOString();

    return {
      platform: platform.name,
      status: 'success',
      timestamp: platform.lastSync,
      message: `Successfully synced with ${platform.name}`,
      syncedItems: this.getSyncedItems(platformId)
    };
  }

  getSyncHistory(platformId) {
    // Simulated sync history
    return [
      {
        timestamp: new Date().toISOString(),
        status: 'success',
        itemsSynced: 10
      }
    ];
  }

  getSyncedItems(platformId) {
    const platform = platforms[platformId.toLowerCase()];
    
    const items = {
      placements: 0,
      licenses: 0,
      royalties: 0
    };

    if (platform.type === 'streaming') {
      items.placements = platform.tracksCount || 0;
    } else if (platform.type === 'advertising') {
      items.placements = platform.activePlacements || 0;
    } else if (platform.type === 'licensing') {
      items.licenses = platform.activeCampaigns || 0;
    }

    return items;
  }
}

module.exports = new PlatformService();
