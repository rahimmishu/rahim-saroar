import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Swords } from 'lucide-react';
import './TicTacToe.css';

interface TicTacToeProps {
  onClose: () => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onClose }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Player starts as X
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);

  const checkWinner = (squares: any[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleDetails = (index: number) => {
    if (board[index] || winner || !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    
    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
    } else if (!newBoard.includes(null)) {
      setIsDraw(true);
    } else {
      setIsXNext(false); // Turn goes to CPU
    }
  };

  // CPU Logic
  useEffect(() => {
    if (!isXNext && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const availableMoves = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
        
        if (availableMoves.length > 0) {
          // Simple AI: Pick random available spot
          const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
          const newBoard = [...board];
          newBoard[randomMove] = 'O';
          setBoard(newBoard);

          const win = checkWinner(newBoard);
          if (win) {
            setWinner(win);
          } else if (!newBoard.includes(null)) {
            setIsDraw(true);
          }
          setIsXNext(true); // Back to Player
        }
      }, 500); // 0.5s delay for realism
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner, isDraw, board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
    setIsXNext(true);
  };

  return (
    <div className="ttt-wrapper animate-in zoom-in duration-300">
      <div className="ttt-card">
        <button onClick={onClose} className="ttt-close"><X size={22} /></button>
        
        <h3 className="flex items-center justify-center gap-2 mb-6 text-xl font-bold text-white">
            <Swords size={20} className="text-purple-400"/> Cyber Tic-Tac-Toe
        </h3>

        <div className={`ttt-status ${winner ? 'winner-text' : ''}`}>
          {winner ? `Winner: ${winner === 'X' ? 'YOU' : 'CPU'}!` : isDraw ? "It's a Draw!" : (isXNext ? "Your Turn (X)" : "CPU Thinking...")}
        </div>

        <div className="ttt-grid">
          {board.map((cell, index) => (
            <div 
              key={index} 
              className={`ttt-cell ${cell === 'X' ? 'cell-x' : 'cell-o'}`} 
              onClick={() => handleDetails(index)}
            >
              {cell}
            </div>
          ))}
        </div>

        <button onClick={resetGame} className="ttt-reset-btn">
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'8px'}}>
            <RotateCcw size={18} /> Restart Game
          </div>
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;