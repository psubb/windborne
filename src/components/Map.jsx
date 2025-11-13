import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function Map({ balloons }) {
  // Default center of the map (center of Earth)
  const center = [0, 0];
  const zoom = 2;

  // Function to normalize longitude to -180 to 180 range
  const normalizeLon = (lon) => {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  };

  // Create wrapped versions of balloons for 3 world copies
  const wrappedBalloons = [];
  balloons.slice(0, 1000).forEach((balloon) => {
    const normalizedLon = normalizeLon(balloon.lon);
    
    // Add balloon at its original position (center)
    wrappedBalloons.push({ ...balloon, lon: normalizedLon, key: `${balloon.lat}-${normalizedLon}-0` });
    
    // Add copies at -360 (left) and +360 (right) longitude for world wrapping
    wrappedBalloons.push({ ...balloon, lon: normalizedLon - 360, key: `${balloon.lat}-${normalizedLon}--360` });
    wrappedBalloons.push({ ...balloon, lon: normalizedLon + 360, key: `${balloon.lat}-${normalizedLon}-360` });
  });

  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '600px', width: '100%' }}
      worldCopyJump={false}
      maxBounds={[
        [-90, -540],  // Southwest corner (3 world copies: -180 * 3)
        [90, 540]     // Northeast corner (180 * 3)
      ]}
      maxBoundsViscosity={1.0}  // Makes bounds "sticky" - can't scroll past them
    >
      {/* Base map tiles from OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Plot each balloon (including wrapped copies) */}
      {wrappedBalloons.map((balloon) => (
        <CircleMarker
          key={balloon.key}
          center={[balloon.lat, balloon.lon]}
          radius={3}
          fillColor="#ff4444"
          color="#cc0000"
          weight={1}
          opacity={0.8}
          fillOpacity={0.6}
        >
          <Popup>
            <div>
              <strong>Balloon Position</strong><br />
              Lat: {balloon.lat.toFixed(2)}<br />
              Lon: {normalizeLon(balloon.lon).toFixed(2)}<br />
              Altitude: {balloon.altitude.toFixed(2)} km<br />
              Hours ago: {balloon.hoursAgo}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default Map;