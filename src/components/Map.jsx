import { MapContainer, TileLayer, CircleMarker, Circle, Popup } from 'react-leaflet';
import MapLegend from './MapLegend';
import 'leaflet/dist/leaflet.css';

function Map({ balloons, populatedPlaces }) {
  const center = [0, 0];
  const zoom = 2;

  // Function to normalize longitude
  const normalizeLon = (lon) => {
    while (lon > 180) lon -= 360;
    while (lon < -180) lon += 360;
    return lon;
  };

  // Create wrapped versions of balloons (showing only current positions - hour 0)
  const currentBalloons = balloons.filter(b => b.hoursAgo === 0);
  const wrappedBalloons = [];
  currentBalloons.forEach((balloon) => {
    const normalizedLon = normalizeLon(balloon.lon);
    
    wrappedBalloons.push({ ...balloon, lon: normalizedLon, key: `${balloon.lat}-${normalizedLon}-0` });
    wrappedBalloons.push({ ...balloon, lon: normalizedLon - 360, key: `${balloon.lat}-${normalizedLon}--360` });
    wrappedBalloons.push({ ...balloon, lon: normalizedLon + 360, key: `${balloon.lat}-${normalizedLon}-360` });
  });

  // Create wrapped versions of populated places
  const wrappedPlaces = [];
  populatedPlaces.forEach((place) => {
    const normalizedLon = normalizeLon(place.lon);
    
    wrappedPlaces.push({ ...place, lon: normalizedLon, key: `${place.name}-0` });
    wrappedPlaces.push({ ...place, lon: normalizedLon - 360, key: `${place.name}--360` });
    wrappedPlaces.push({ ...place, lon: normalizedLon + 360, key: `${place.name}-360` });
  });

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '600px', width: '100%' }}
        worldCopyJump={false}
        maxBounds={[
          [-90, -540],
          [90, 540]
        ]}
        maxBoundsViscosity={1.0}
      >
        {/* Base map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Population coverage circles (500km radius) */}
        {wrappedPlaces.map((place) => (
          <Circle
            key={`circle-${place.key}`}
            center={[place.lat, place.lon]}
            radius={500000}  // 500km in meters
            fillColor="#4CAF50"
            color="#2E7D32"
            weight={1}
            opacity={0.3}
            fillOpacity={0.1}
          />
        ))}
        
        {/* Major cities as yellow dots */}
        {wrappedPlaces.map((place) => (
          <CircleMarker
            key={`place-${place.key}`}
            center={[place.lat, place.lon]}
            radius={4}
            fillColor="#FFD700"
            color="#FFA500"
            weight={1}
            opacity={0.8}
            fillOpacity={0.7}
          >
            <Popup>
              <div>
                <strong>{place.name}</strong><br />
                {place.country}<br />
                Population: {place.pop_max ? place.pop_max.toLocaleString() : 'N/A'}
              </div>
            </Popup>
          </CircleMarker>
        ))}
        
        {/* Balloons as red dots */}
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
                Altitude: {balloon.altitude.toFixed(2)} km
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      
      <MapLegend />
    </div>
  );
}

export default Map;