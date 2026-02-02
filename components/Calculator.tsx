import React, { useState, useEffect } from 'react';
import { X, Sun, Moon } from 'lucide-react'; // আইকনের জন্য Lucide ব্যবহার করা হচ্ছে
import './Calculator.css';

interface CalculatorProps {
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (!isNaN(Number(key)) || key === '.') appendNumber(key);
      else if (['+', '-', '*', '/', '%'].includes(key)) appendOperator(key);
      else if (key === 'Enter' || key === '=') calculate();
      else if (key === 'Backspace') deleteLast();
      else if (key === 'Escape') setDisplay('');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]); // Dependency added to capture latest state if needed

  const appendNumber = (number: string) => {
    if (display === 'Error') setDisplay(number);
    else setDisplay((prev) => prev + number);
  };

  const appendOperator = (operator: string) => {
    if (display === 'Error') return;
    const lastChar = display.slice(-1);
    if (display === '' || ['+', '-', '*', '/', '%'].includes(lastChar)) return;
    setDisplay((prev) => prev + operator);
  };

  const clearDisplay = () => {
    setDisplay('');
  };

  const deleteLast = () => {
    if (display === 'Error') setDisplay('');
    else setDisplay((prev) => prev.toString().slice(0, -1));
  };

  const calculate = () => {
    try {
      if (display === '') return;
      // eslint-disable-next-line no-eval
      let result = eval(display); // Simple eval for calculator logic
      if (!isFinite(result) || isNaN(result)) {
        setDisplay('Error');
      } else {
        setDisplay(result.toString());
      }
    } catch (error) {
      setDisplay('Error');
    }
  };

  return (
    <div className={`calculator-wrapper ${isDark ? 'dark' : ''} animate-in zoom-in duration-300`}>
      <button onClick={onClose} className="calc-close-btn">
        <X size={20} />
      </button>

      <div className="calc-container">
        <div className="calc-header">
          <span className="calc-brand">Calc.</span>
          <div className="calc-theme-toggler" onClick={() => setIsDark(!isDark)}>
            <div className={`calc-icon ${!isDark ? 'active' : ''}`}>
                <Sun size={14} />
            </div>
            <div className={`calc-icon ${isDark ? 'active' : ''}`}>
                <Moon size={14} />
            </div>
          </div>
        </div>

        <div className="calc-display-container">
          <input 
            type="text" 
            className="calc-display" 
            id="display" 
            value={display} 
            placeholder="0" 
            readOnly 
          />
        </div>

        <div className="calc-buttons">
          <button className="calc-btn calc-action" onClick={clearDisplay}>AC</button>
          <button className="calc-btn calc-action" onClick={deleteLast}>DEL</button>
          <button className="calc-btn calc-operator" onClick={() => appendOperator('%')}>%</button>
          <button className="calc-btn calc-operator" onClick={() => appendOperator('/')}>÷</button>

          <button className="calc-btn" onClick={() => appendNumber('7')}>7</button>
          <button className="calc-btn" onClick={() => appendNumber('8')}>8</button>
          <button className="calc-btn" onClick={() => appendNumber('9')}>9</button>
          <button className="calc-btn calc-operator" onClick={() => appendOperator('*')}>×</button>

          <button className="calc-btn" onClick={() => appendNumber('4')}>4</button>
          <button className="calc-btn" onClick={() => appendNumber('5')}>5</button>
          <button className="calc-btn" onClick={() => appendNumber('6')}>6</button>
          <button className="calc-btn calc-operator" onClick={() => appendOperator('-')}>-</button>

          <button className="calc-btn" onClick={() => appendNumber('1')}>1</button>
          <button className="calc-btn" onClick={() => appendNumber('2')}>2</button>
          <button className="calc-btn" onClick={() => appendNumber('3')}>3</button>
          <button className="calc-btn calc-operator" onClick={() => appendOperator('+')}>+</button>

          <button className="calc-btn" onClick={() => appendNumber('0')}>0</button>
          <button className="calc-btn" onClick={() => appendNumber('.')}>.</button>
          <button className="calc-btn calc-equal" onClick={calculate}>=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;