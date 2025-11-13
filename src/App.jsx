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
        <h1>🎈 Windborne Population Coverage Dashboard</h1>
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
        padding: '25px 20px', 
        backgroundColor: '#1a1a1a', 
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '8px' }}>🎈 Windborne Population Coverage Dashboard</h1>
        <p style={{ margin: '8px 0', fontSize: '16px', color: '#ccc' }}>
          Visualizing Global Atmospheric Monitoring and Population Impact
        </p>
        <div style={{ marginTop: '18px' }}>
          <p style={{ margin: '8px 0', fontSize: '20px', fontWeight: 'bold' }}>
            Created by Pranav Subbiah
          </p>
          <div style={{ marginTop: '10px' }}>
            <a 
              href="https://linkedin.com/in/psubb" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#646cff', 
                margin: '0 12px',
                textDecoration: 'none',
                fontSize: '17px',
                fontWeight: '500'
              }}
            >
              LinkedIn
            </a>
            <span style={{ color: '#666', fontSize: '17px' }}>|</span>
            <a 
              href="https://github.com/psubb" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#646cff', 
                margin: '0 12px',
                textDecoration: 'none',
                fontSize: '17px',
                fontWeight: '500'
              }}
            >
              GitHub
            </a>
          </div>
        </div>
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
        padding: '25px 20px', 
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white',
        borderTop: '2px solid #333'
      }}>
        <p style={{ margin: '12px 0', fontSize: '14px', color: '#ccc', lineHeight: '1.6' }}>
          This interactive dashboard combines live weather balloon tracking data with global population 
          centers to analyze atmospheric data collection coverage. The visualization demonstrates how 
          Windborne's balloon network provides critical atmospheric insights over populated regions, 
          supporting weather forecasting, climate research, and disaster preparedness for millions of people worldwide.
        </p>
        
        <div style={{ 
          paddingTop: '15px', 
          marginTop: '15px',
          borderTop: '1px solid #333',
          fontSize: '13px',
          color: '#999'
        }}>
          <p style={{ margin: '5px 0' }}>
            Data Sources: <a href="https://windbornesystems.com" target="_blank" rel="noopener noreferrer" style={{ color: '#646cff' }}>
              Windborne Systems
            </a> • <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#646cff' }}>
              Natural Earth
            </a>
          </p>
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Showing current positions (Hour 0) with 500km coverage radius
          </p>
        </div>
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