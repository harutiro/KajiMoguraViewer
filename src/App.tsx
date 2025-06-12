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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // 時間に基づいてダークモードを設定
  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      setIsDarkMode(currentHour >= 21 || currentHour < 9);
    };

    // 初回実行
    checkTime();

    // 1分ごとに時間をチェック
    const timeIntervalId = setInterval(checkTime, 60000);

    return () => clearInterval(timeIntervalId);
  }, []);

  // 在室状況の確認
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

    // 初回実行
    fetchData();

    // 1分ごとに更新
    const intervalId = setInterval(fetchData, 60000);

    // クリーンアップ関数
    return () => clearInterval(intervalId);
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
      color: isDarkMode ? '#fff' : '#333',
      textAlign: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: isDarkMode ? '#000' : '#f5f5f5',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {isDarkMode ? (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          zIndex: 1
        }} />
      ) : (
        isKajiPresent ? (
          <img 
            src="/kajiMogura.png" 
            alt="kajiMogura" 
            style={{
              maxWidth: '80%',
              maxHeight: '80vh',
              objectFit: 'contain',
              zIndex: 2
            }}
          />
        ) : (
          <img 
            src="/kajihouse.png" 
            alt="kajiMogura" 
            style={{
              maxWidth: '80%',
              maxHeight: '80vh',
              objectFit: 'contain',
              zIndex: 2
            }}
          />
        )
      )}
    </div>
  )
}

export default App
