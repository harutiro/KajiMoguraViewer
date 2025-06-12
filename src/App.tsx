import { useState, useEffect } from 'react'

interface Stayer {
  id: number;
  name: string;
  room: string;
  roomId: number;
  tags: { id: number; name: string; }[];
}

function App() {
  const [isKajiPresent, setIsKajiPresent] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://staywatch-backend.kajilab.net/api/v1/stayers');
        const data: Stayer[] = await response.json();
        console.log('API Response:', data);
        const kajiExists = data.some(stayer => stayer.name === 'kaji');
        console.log('Is Kaji present:', kajiExists);
        setIsKajiPresent(kajiExists);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      width: '100vw',
      fontSize: '8rem',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#f5f5f5'
    }}>
      {isKajiPresent ? 'います' : 'いません'}
    </div>
  )
}

export default App
