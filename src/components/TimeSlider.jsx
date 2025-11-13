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
    }, 1000); // Changed from 800ms to 1000ms (1 second) for smoother feel

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
        color: '#ff4444',
        minHeight: '27px' // Prevents layout shift
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
            minWidth: '80px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.opacity = '1';
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>

        {/* Slider */}
        <div style={{ flex: 1, position: 'relative' }}>
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
              width: '100%',
              height: '8px',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              background: `linear-gradient(to right, #ff4444 0%, #ff4444 ${(currentHour / (totalHours - 1)) * 100}%, #555 ${(currentHour / (totalHours - 1)) * 100}%, #555 100%)`,
              borderRadius: '5px',
              outline: 'none'
            }}
          />
          <style>
            {`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ff4444;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
              }
              input[type="range"]::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
              }
              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ff4444;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
              }
              input[type="range"]::-moz-range-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 3px 6px rgba(0,0,0,0.4);
              }
            `}
          </style>
        </div>

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