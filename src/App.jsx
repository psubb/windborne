import { useEffect, useState } from 'react';
import { fetchAllBalloonData } from './utils/balloonData';
import { fetchPopulatedPlaces, calculatePopulationCoverage } from './utils/populationData';
import Map from './components/Map';
import './App.css';

function App() {
  const [balloons, setBalloons] = useState([]);
  const [populatedPlaces, setPopulatedPlaces] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component loads
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Starting to load all data...');
        
        // Fetch both datasets in parallel
        const [balloonData, populationData] = await Promise.all([
          fetchAllBalloonData(),
          fetchPopulatedPlaces()
        ]);
        
        setBalloons(balloonData);
        setPopulatedPlaces(populationData);
        
        // Calculate analytics
        const stats = calculatePopulationCoverage(
          balloonData.filter(b => b.hoursAgo === 0), // Only current balloons
          populationData
        );
        setAnalytics(stats);
        
        setLoading(false);
        console.log('✓ All data loaded successfully!');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>🎈 Windborne Balloon Explorer</h1>
        <p>Loading balloon and population data...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          This may take a few seconds...
        </p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>❌ Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Show the app!
  return (
    <div className="App">
      <header style={{ 
        padding: '20px', 
        backgroundColor: '#1a1a1a', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>🎈 Windborne Balloon Explorer</h1>
        <p style={{ margin: '10px 0', fontSize: '16px' }}>
          Global Atmospheric Data Collection Network
        </p>
      </header>

      {/* Analytics Dashboard */}
      {analytics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          padding: '20px',
          backgroundColor: '#f4f4f4'
        }}>
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{balloons.length.toLocaleString()}</div>
            <div style={statLabelStyle}>Total Balloon Positions (24h)</div>
          </div>
          
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{analytics.balloonsOverPopulated.toLocaleString()}</div>
            <div style={statLabelStyle}>Balloons Over Populated Areas</div>
          </div>
          
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{analytics.percentageOverPopulated}%</div>
            <div style={statLabelStyle}>Coverage of Populated Regions</div>
          </div>
          
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{analytics.citiesCovered}</div>
            <div style={statLabelStyle}>Major Cities Covered</div>
          </div>
          
          <div style={statCardStyle}>
            <div style={statNumberStyle}>{analytics.estimatedPopulationCovered}M</div>
            <div style={statLabelStyle}>Est. Population Under Coverage</div>
          </div>
        </div>
      )}

      <main>
        <Map balloons={balloons} populatedPlaces={populatedPlaces} />
      </main>

      <footer style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Data from <a href="https://windbornesystems.com" target="_blank" rel="noopener noreferrer" style={{ color: '#646cff' }}>
            Windborne Systems
          </a> • Population data from <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#646cff' }}>
            Natural Earth
          </a>
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
          Showing current positions (Hour 0) with 500km coverage radius
        </p>
      </footer>
    </div>
  );
}

// Inline styles for stat cards
const statCardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const statNumberStyle = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ff4444',
  marginBottom: '8px'
};

const statLabelStyle = {
  fontSize: '14px',
  color: '#666'
};

export default App;