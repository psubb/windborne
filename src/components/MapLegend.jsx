function MapLegend() {
  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      right: '10px',
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
      fontSize: '13px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Legend</div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#ff4444',
          border: '1px solid #cc0000',
          marginRight: '8px'
        }}></div>
        <span>Weather Balloons</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#FFD700',
          border: '1px solid #FFA500',
          marginRight: '8px'
        }}></div>
        <span>Major Cities</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: '#4CAF50',
          border: '1px solid #2E7D32',
          opacity: 0.3,
          marginRight: '8px'
        }}></div>
        <span>Coverage Zone (500km)</span>
      </div>
      
      <div style={{ 
        marginTop: '12px', 
        paddingTop: '10px', 
        borderTop: '1px solid #ddd',
        fontSize: '11px',
        color: '#666'
      }}>
        Showing current positions (Hour 0)
      </div>
    </div>
  );
}

export default MapLegend;