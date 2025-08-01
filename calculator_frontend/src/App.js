import React, { useState, useEffect } from 'react';
import './App.css';

// Button grid definition
const BUTTONS = [
  ['7', '8', '9', '/'],
  ['4', '5', '6', '*'],
  ['1', '2', '3', '-'],
  ['0', 'C', '=', '+'],
];

// Calculator colors (from requirements)
const COLORS = {
  accent: '#ffc107',
  primary: '#1976d2',
  secondary: '#424242',
};

/**
 * Evaluates a simple arithmetic expression safely.
 * Only +, -, *, / supported. No parenthesis or functions.
 * Returns a string with result or "Error" if invalid.
 *
 * @param {string} expr
 */
function safeEval(expr) {
  try {
    // Prevent potentially unsafe evaluation
    if (!/^[\d\.\+\-\*\/\s]+$/.test(expr)) return 'Error';
    // eslint-disable-next-line no-eval
    // Rounding result for division floating points
    // Replace multiple operators in a row (unsupported) with error
    if (/[\+\-\*\/]{2,}/.test(expr)) return 'Error';
    const result = eval(expr);
    if (typeof result === "number" && isFinite(result)) {
      // Formatting: max 8 decimals, remove trailing 0s
      return result % 1 === 0 ? result.toString() : parseFloat(result.toFixed(8)).toString();
    } else {
      return 'Error';
    }
  } catch {
    return 'Error';
  }
}

// PUBLIC_INTERFACE
function App() {
  // App theme state (for demonstration: no toggle, always light)
  const [theme] = useState('light');

  // Input and result display state
  const [expr, setExpr] = useState('');
  const [display, setDisplay] = useState('0');
  const [justEvaluated, setJustEvaluated] = useState(false);

  // Apply theme colors (set CSS variables)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Additional custom CSS variables for calculator color guidance:
    document.documentElement.style.setProperty('--calc-primary', COLORS.primary);
    document.documentElement.style.setProperty('--calc-secondary', COLORS.secondary);
    document.documentElement.style.setProperty('--calc-accent', COLORS.accent);
  }, [theme]);

  // PUBLIC_INTERFACE
  const handleButtonClick = (value) => {
    if (value === 'C') {
      setExpr('');
      setDisplay('0');
      setJustEvaluated(false);
    } else if (value === '=') {
      const result = safeEval(expr);
      setDisplay(result);
      setExpr(result !== 'Error' ? result : '');
      setJustEvaluated(true);
    } else if ('+-*/'.includes(value)) {
      // Prevent consecutive operators
      if (expr.length === 0 && value !== '-') return;
      if (/[+\-*/]$/.test(expr)) {
        setExpr(expr.replace(/[+\-*/]+$/, value));
      } else {
        setExpr(expr + value);
      }
      setJustEvaluated(false);
    } else {
      // Number or dot
      if (justEvaluated && !/[+\-*/]/.test(value)) {
        setExpr(value);
        setDisplay(value);
        setJustEvaluated(false);
      } else {
        setExpr(expr === '0' ? value : expr + value);
        setDisplay(expr === '0' ? value : expr + value);
        setJustEvaluated(false);
      }
    }
  };

  // Update display to match expr (when expr changes not by =)
  useEffect(() => {
    if (!justEvaluated) setDisplay(expr.length === 0 ? '0' : expr);
    // eslint-disable-next-line
  }, [expr]);

  return (
    <div className="calculator-app">
      <h2 className="calc-title">Calculator</h2>
      <div className="calculator-container">
        <div className="calculator-display" data-testid="calc-display">{display}</div>
        <div className="calculator-grid">
          {BUTTONS.flat().map((button) => (
            <button
              key={button}
              className={`calculator-btn${
                button === '=' ? ' operator equals' :
                button === 'C' ? ' clear' :
                '+-*/'.includes(button) ? ' operator' : ''
              }`}
              onClick={() => handleButtonClick(button)}
              aria-label={`Calculator Button ${button}`}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
      <footer className="calc-attribution">
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Powered by React
        </a>
      </footer>
    </div>
  );
}

export default App;
