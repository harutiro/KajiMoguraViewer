import { useState, useEffect } from 'react'
import './animations.css'

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
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [currentAnimation, setCurrentAnimation] = useState<string>('');
  const [showDebug, setShowDebug] = useState<boolean>(false);

  // アニメーションの種類を定義
  const animationTypes = [
    'kajiAnimation',
    'bounceAnimation', 
    'spinAnimation',
    'pulseAnimation',
    'zigzagAnimation',
    'floatAnimation',
    'shakeAnimation',
    'waveAnimation',
    'jumpAnimation',
    'danceAnimation'
  ];

  // ランダムにアニメーションを選択
  const getRandomAnimation = () => {
    const randomIndex = Math.floor(Math.random() * animationTypes.length);
    return animationTypes[randomIndex];
  };

  // キーボードショートカットでデバッグ表示切り替え
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        setShowDebug(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // アニメーションを手動でトリガーする関数
  const triggerAnimation = () => {
    const selectedAnimation = getRandomAnimation();
    console.log('アニメーション開始:', selectedAnimation, new Date().toLocaleTimeString());
    setDebugInfo(`アニメーション開始: ${selectedAnimation} - ${new Date().toLocaleTimeString()}`);
    setCurrentAnimation(selectedAnimation);
    setIsAnimating(true);
    
    // 3秒後にアニメーションを停止
    setTimeout(() => {
      console.log('アニメーション終了:', selectedAnimation, new Date().toLocaleTimeString());
      setDebugInfo(`アニメーション終了: ${selectedAnimation} - ${new Date().toLocaleTimeString()}`);
      setIsAnimating(false);
      setCurrentAnimation('');
    }, 3000);
  };

  // 15分に一度アニメーションを実行
  useEffect(() => {
    // 初回実行（15分後に開始）
    const initialTimeout = setTimeout(triggerAnimation, 15 * 60 * 1000);

    // 15分ごとにアニメーションを実行
    const animationInterval = setInterval(triggerAnimation, 15 * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(animationInterval);
    };
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

  // アニメーション用のスタイル
  const getAnimationStyle = () => {
    if (!isAnimating) {
      return {
        maxWidth: '80%',
        maxHeight: '80vh',
        objectFit: 'contain' as const,
        zIndex: 2,
        transition: 'all 0.3s ease'
      };
    }

    return {
      maxWidth: '80%',
      maxHeight: '80vh',
      objectFit: 'contain' as const,
      zIndex: 2,
      animation: `${currentAnimation} 3s ease-in-out`,
      transition: 'all 0.3s ease'
    };
  };

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
      {/* デバッグ用ボタン（非表示時は小さなインジケーターのみ） */}
      {showDebug ? (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000
        }}>
          <button 
            onClick={triggerAnimation}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: isAnimating ? '#ff6b6b' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            {isAnimating ? 'アニメーション中...' : 'アニメーション開始'}
          </button>
          <div style={{
            fontSize: '14px',
            color: isDarkMode ? '#fff' : '#333',
            backgroundColor: 'rgba(0,0,0,0.1)',
            padding: '10px',
            borderRadius: '5px',
            maxWidth: '300px'
          }}>
            <div>在室状況: {isKajiPresent ? '在室' : '不在'}</div>
            <div>アニメーション: {isAnimating ? 'ON' : 'OFF'}</div>
            <div>現在のアニメーション: {currentAnimation || 'なし'}</div>
            <div>デバッグ: {debugInfo}</div>
            <div style={{ fontSize: '12px', marginTop: '10px', opacity: 0.7 }}>
              Ctrl+D でデバッグ表示切り替え
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: isAnimating ? '#ff6b6b' : '#4CAF50',
            borderRadius: '50%',
            opacity: 0.6,
            cursor: 'pointer'
          }} 
          onClick={() => setShowDebug(true)}
          title="Ctrl+D でデバッグ表示"
          />
        </div>
      )}

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
            style={getAnimationStyle()}
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
