/**
 * Fetches populated places data from Natural Earth (via GitHub)
 * @returns {Promise<Array>} Array of populated places
 */
export async function fetchPopulatedPlaces() {
  const url = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_populated_places_simple.geojson';
  
  try {
    console.log('Fetching populated places data...');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch population data: ${response.status}`);
    }
    
    const geojson = await response.json();
    
    // Transform GeoJSON features into simple objects
    const places = geojson.features.map(feature => ({
      name: feature.properties.name,
      pop_max: feature.properties.pop_max || feature.properties.pop_min || 0,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      country: feature.properties.adm0name
    }));
    
    console.log(`✓ Loaded ${places.length} populated places`);
    
    return places;
  } catch (error) {
    console.error('Error fetching population data:', error);
    return [];
  }
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * Calculate analytics about balloon coverage over populated areas
 * @param {Array} balloons 
 * @param {Array} populatedPlaces 
 * @returns {Object} Analytics data
 */
export function calculatePopulationCoverage(balloons, populatedPlaces) {
  const COVERAGE_RADIUS = 500; // km - balloons can sense within 500km radius
  
  let balloonsOverPopulated = 0;
  let totalPopulationCovered = 0;
  const coveredCities = new Set();
  
  balloons.forEach(balloon => {
    let isOverPopulated = false;
    
    populatedPlaces.forEach(place => {
      const distance = calculateDistance(
        balloon.lat,
        balloon.lon,
        place.lat,
        place.lon
      );
      
      if (distance <= COVERAGE_RADIUS) {
        isOverPopulated = true;
        coveredCities.add(place.name);
        totalPopulationCovered += place.pop_max;
      }
    });
    
    if (isOverPopulated) {
      balloonsOverPopulated++;
    }
  });
  
  return {
    totalBalloons: balloons.length,
    balloonsOverPopulated,
    percentageOverPopulated: ((balloonsOverPopulated / balloons.length) * 100).toFixed(1),
    citiesCovered: coveredCities.size,
    estimatedPopulationCovered: Math.round(totalPopulationCovered / 1000000) // in millions
  };
}