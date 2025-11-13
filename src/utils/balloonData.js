const BASE_URL = 'https://corsproxy.io/?https://a.windbornesystems.com/treasure';

/**
 * Fetches balloon data for a specific hour
 * @param {number} hour - Hour offset (0 = current, 1 = 1 hour ago, etc.)
 * @returns {Promise<Array>} Array of balloon positions
 */
async function fetchBalloonDataForHour(hour) {
  // Format: 00.json, 01.json, etc.
  const filename = hour.toString().padStart(2, '0') + '.json';
  const url = `${BASE_URL}/${filename}`;
  
  try {
    console.log(`Fetching ${filename}...`);
    const response = await fetch(url);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch ${filename}: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validate that we got an array
    if (!Array.isArray(data)) {
      throw new Error(`Invalid data format for ${filename}`);
    }
    
    console.log(`Fetched ${data.length} balloons from ${filename}`);
    
    // Transform [lat, lon, alt] into objects with named properties
    return data.map(position => ({
      lat: position[0],
      lon: position[1],
      altitude: position[2],
      hoursAgo: hour
    }));
    
  } catch (error) {
    console.warn(`Error fetching hour ${hour}:`, error.message);
    return []; // Return empty array on error (robust handling)
  }
}

/**
 * Fetches all 24 hours of balloon data
 * @returns {Promise<Array>} Combined array of all balloon positions
 */
export async function fetchAllBalloonData() {
  console.log('Starting to fetch balloon data for 24 hours...');
  
  // Create an array of promises for all 24 hours
  const promises = [];
  for (let hour = 0; hour < 24; hour++) {
    promises.push(fetchBalloonDataForHour(hour));
  }
  
  // Wait for all promises to complete (runs in parallel - FAST!)
  const results = await Promise.all(promises);
  
  // Flatten the array of arrays into a single array
  const allBalloons = results.flat();
  
  console.log(`Successfully fetched ${allBalloons.length} total balloon positions`);
  
  return allBalloons;
}

/**
 * Gets current balloon positions only (most recent hour)
 * @returns {Promise<Array>} Current balloon positions
 */
export async function getCurrentBalloonPositions() {
  console.log('Fetching current balloon positions...');
  return fetchBalloonDataForHour(0);
}