import { useEffect, useState } from 'react';
import { fetchAllBalloonData } from './utils/balloonData';
import Map from './components/Map';
import './App.css';

function App() {
  const [balloons, setBalloons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component loads
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Starting to fetch balloon data...');
        const data = await fetchAllBalloonData();
        setBalloons(data);
        setLoading(false);
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
        <p>Loading balloon data...</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Fetching 24 hours of balloon positions...
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

  // Show the map!
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
          Tracking {balloons.length.toLocaleString()} balloon positions over 24 hours
        </p>
      </header>

      <main>
        <Map balloons={balloons} />
      </main>

      <footer style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#f4f4f4'
      }}>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          Data from <a href="https://windbornesystems.com" target="_blank" rel="noopener noreferrer">
            Windborne Systems
          </a>
        </p>
        <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
          Showing current balloon positions (Hour 0: {balloons.filter(b => b.hoursAgo === 0).length} balloons)
        </p>
      </footer>
    </div>
  );
}

export default App;