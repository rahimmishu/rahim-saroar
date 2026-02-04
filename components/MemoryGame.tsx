import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './MemoryGame.css';

interface MemoryGameProps {
  onClose: () => void;
}

interface CardType {
  id: number;
  maskType: string;
  face: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const FACES = ["🙂", "😄", "😜", "😮", "😉", "😌"];
const MASKS = [
  'alien', 'ogre', 'robot', 'clown', 'pumpkin', 'frog',
  'skull', 'cow', 'disguise', 'eye', 'dragon', 'fox'
];

const MemoryGame: React.FC<MemoryGameProps> = ({ onClose }) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [tries, setTries] = useState(0);
  const [best, setBest] = useState(0);
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [marqueeText, setMarqueeText] = useState("");
  const [showMarquee, setShowMarquee] = useState(false);
  const [combo, setCombo] = useState(0);

  // Initialize Game
  useEffect(() => {
    setupGame();
  }, []);

  const setupGame = () => {
    setLoading(true);
    setCompleted(false);
    setTries(0);
    setCombo(0);
    setMarqueeText("");
    setShowMarquee(false);

    // Double faces and shuffle
    const deckFaces = [...FACES, ...FACES].sort(() => Math.random() - 0.5);
    // Shuffle mask positions
    const shuffledMasks = [...MASKS].sort(() => Math.random() - 0.5);

    const newCards = shuffledMasks.map((mask, index) => ({
      id: index,
      maskType: mask,
      face: deckFaces[index],
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleCardClick = (id: number) => {
    if (loading || waiting || completed) return;
    const currentCard = cards.find(c => c.id === id);
    if (!currentCard || currentCard.isMatched || currentCard.isFlipped) return;

    // Flip the clicked card
    const updatedCards = cards.map(c => c.id === id ? { ...c, isFlipped: true } : c);
    setCards(updatedCards);

    // Check for match
    const flippedCards = updatedCards.filter(c => c.isFlipped && !c.isMatched);

    if (flippedCards.length === 2) {
      setWaiting(true);
      setTries(prev => prev + 1);

      const [card1, card2] = flippedCards;

      if (card1.face === card2.face) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === card1.id || c.id === card2.id) 
              ? { ...c, isMatched: true, isFlipped: true } 
              : c
          ));
          setWaiting(false);
          
          // Combo Logic
          const newCombo = combo + 1;
          setCombo(newCombo);
          if(newCombo > 1) {
             setMarqueeText(`${newCombo}×!`);
             setShowMarquee(true);
             setTimeout(() => setShowMarquee(false), 2000);
          }

          // Check Win
          if (updatedCards.filter(c => c.isMatched).length + 2 === cards.length) {
            handleWin();
          }
        }, 500);
      } else {
        // No match
        setCombo(0);
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            (c.id === card1.id || c.id === card2.id) 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setWaiting(false);
        }, 1000);
      }
    }
  };

  const handleWin = () => {
    setMarqueeText("Unmasked!");
    setShowMarquee(true);
    setCompleted(true);
    if (best === 0 || tries + 1 < best) {
      setBest(tries + 1);
    }
  };

  // Helper to render mask HTML based on type
  const renderMaskContent = (type: string) => {
    switch (type) {
      case 'alien': return <div className="alien-mask"><span className="mask">👽</span><span className="hand">🫰</span></div>;
      case 'ogre': return <div className="ogre-mask"><span className="hand">🫸</span><span className="mask">👹</span><span className="hand">🫷</span></div>;
      case 'robot': return <div className="robot-mask"><span className="mask">🤖</span><span className="hand">🫳</span></div>;
      case 'clown': return <div className="clown-mask"><span className="hand">🫸</span><span className="mask">🤡</span><span className="hand">🫷</span></div>;
      case 'pumpkin': return <div className="pumpkin-mask"><span className="mask">🎃</span><span className="hand">🫳</span></div>;
      case 'frog': return <div className="frog-mask"><span className="mask">🐸</span><span className="hand">🫰</span></div>;
      case 'skull': return <div className="skull-mask"><span className="mask">💀</span><span className="hand">👌</span></div>;
      case 'cow': return <div className="cow-mask"><span className="mask">🐮</span><span className="hand">🫳</span></div>;
      case 'disguise': return <div className="disguise-mask"><span className="hand">🫸</span><span className="mask">🥸</span><span className="hand">🫷</span></div>;
      case 'eye': return <div className="eye-mask"><span className="mask">👁️</span><span className="hand">👌</span></div>;
      case 'dragon': return <div className="dragon-mask"><span className="mask">🐲</span><span className="hand">🫰</span></div>;
      case 'fox': return <div className="fox-mask"><span className="mask">🦊</span><span className="hand">🫰</span></div>;
      default: return null;
    }
  };

  return (
    <div className="memory-wrapper">
      <button onClick={onClose} className="mem-close-btn"><X size={24} /></button>
      
      <main className="game-main">
        <div className="game">
          <div className={`board ${loading ? 'is-loading' : ''} ${waiting ? 'is-waiting' : ''} ${completed ? 'is-complete' : ''}`}>
            {cards.map((card, index) => (
              <button 
                key={card.id} 
                className={`mem-card ${card.isMatched ? 'is-matched' : ''}`}
                aria-pressed={card.isFlipped}
                disabled={card.isMatched}
                onClick={() => handleCardClick(card.id)}
                style={{'--i': index} as React.CSSProperties}
              >
                <div className="content">
                  <span className="face">{card.face}</span>
                  <div className="prop">
                    {renderMaskContent(card.maskType)}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {showMarquee && (
            <div className={`marquee ${combo > 1 ? 'is-combo' : ''}`} style={{display: 'grid'}}>
              <span className="marquee-text">{marqueeText}</span>
            </div>
          )}
        </div>

        <div className="interface">
          <div className="interface-data">Tries: <span>{tries}</span></div>
          {best > 0 && <div className="interface-data">Best: <span>{best}</span></div>}
          <button onClick={setupGame} className="interface-btn">Reset game</button>
        </div>
      </main>
    </div>
  );
};

export default MemoryGame;