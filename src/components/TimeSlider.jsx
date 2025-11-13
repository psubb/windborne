import { useState, useEffect } from 'react';

function TimeSlider({ currentHour, onHourChange, totalHours = 24 }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onHourChange((prev) => {
        if (prev >= totalHours - 1) {
          setIsPlaying(false);
          return 0; // Loop back to start
        }
        return prev + 1;
      });
    }, 800); // Change every 800ms (0.8 seconds)

    return () => clearInterval(interval);
  }, [isPlaying, onHourChange, totalHours]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getTimeLabel = () => {
    if (currentHour === 0) return 'Current Position';
    if (currentHour === 1) return '1 hour ago';
    return `${currentHour} hours ago`;
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#2a2a2a',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px'
    }}>
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 'bold',
        color: '#ff4444'
      }}>
        {getTimeLabel()}
      </div>

      <div style={{ 
        width: '100%', 
        maxWidth: '800px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPause}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: isPlaying ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: '80px'
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        {/* Slider */}
        <input
          type="range"
          min="0"
          max={totalHours - 1}
          value={currentHour}
          onChange={(e) => {
            setIsPlaying(false); // Stop auto-play when manually sliding
            onHourChange(Number(e.target.value));
          }}
          style={{
            flex: 1,
            height: '8px',
            cursor: 'pointer',
            accentColor: '#ff4444'
          }}
        />

        {/* Hour Labels */}
        <div style={{ 
          minWidth: '100px',
          textAlign: 'right',
          fontSize: '14px',
          color: '#999'
        }}>
          Hour {currentHour} / {totalHours - 1}
        </div>
      </div>

      {/* Timeline markers */}
      <div style={{ 
        width: '100%', 
        maxWidth: '800px',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#666',
        paddingLeft: '95px', // Align with slider
        paddingRight: '115px'
      }}>
        <span>Now</span>
        <span>6h ago</span>
        <span>12h ago</span>
        <span>18h ago</span>
        <span>23h ago</span>
      </div>
    </div>
  );
}

export default TimeSlider;