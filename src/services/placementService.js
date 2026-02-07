/**
 * Placement Service
 * Business logic for music placement tracking
 */

// In-memory storage (replace with database in production)
let placements = [
  {
    id: '1',
    trackName: 'ScrollSoul Anthem',
    artist: 'ScrollSoul',
    placementType: 'TV Commercial',
    brand: 'Nike',
    campaign: 'Just Do It 2024',
    airDate: '2024-01-15',
    duration: 30,
    territory: 'Global',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    trackName: 'Galactic Frequencies',
    artist: 'ScrollSoul',
    placementType: 'Sports',
    brand: 'NCAA',
    campaign: 'March Madness 2024',
    airDate: '2024-03-01',
    duration: 15,
    territory: 'USA',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

class PlacementService {
  getAllPlacements() {
    return placements;
  }

  getPlacementById(id) {
    return placements.find(p => p.id === id);
  }

  createPlacement(data) {
    const placement = {
      id: String(placements.length + 1),
      trackName: data.trackName,
      artist: data.artist || 'ScrollSoul',
      placementType: data.placementType,
      brand: data.brand,
      campaign: data.campaign,
      airDate: data.airDate,
      duration: data.duration,
      territory: data.territory || 'Global',
      status: data.status || 'pending',
      createdAt: new Date().toISOString()
    };
    placements.push(placement);
    return placement;
  }

  updatePlacement(id, data) {
    const index = placements.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    placements[index] = {
      ...placements[index],
      ...data,
      id: placements[index].id, // Preserve ID
      updatedAt: new Date().toISOString()
    };
    return placements[index];
  }

  deletePlacement(id) {
    const index = placements.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    placements.splice(index, 1);
    return true;
  }
}

module.exports = new PlacementService();
