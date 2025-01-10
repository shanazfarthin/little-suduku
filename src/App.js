import React, { useState, useEffect } from 'react';

import './App.css';
import { ReactComponent as FishIcon } from './assets/fish1.svg';
import { ReactComponent as FishIcon2 } from './assets/fish2.svg'; // Second fish icon
import { ReactComponent as FishIcon3 } from './assets/fish3.svg'; // Third fish icon



const generateGrid = (level) => {
  const totalCells = 3 * 3; // 3x3 grid
  const emptyCells = Math.min(level, totalCells); // Ensure it doesn't exceed total cells
  const grid = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null)); // Initialize empty grid

  const numbers = Array.from({ length: totalCells }, (_, i) => i + 1); // Numbers 1-9
  const shuffled = numbers.sort(() => Math.random() - 0.5); // Shuffle numbers randomly

  // Randomly place the required number of non-empty cells
  const filledCells = totalCells - emptyCells;
  const randomPositions = Array.from({ length: totalCells }, (_, i) => i).sort(() => Math.random() - 0.5); // Randomize cell positions

  for (let i = 0; i < filledCells; i++) {
    const position = randomPositions[i];
    const row = Math.floor(position / 3);
    const col = position % 3;
    grid[row][col] = shuffled[i];
  }

  return grid;
};

function App() {
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState(generateGrid(1));
  const [errors, setErrors] = useState([]);
  const [frozenCells, setFrozenCells] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    let timer;
    if (startTime && !completed) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startTime, completed]);

  const validateGrid = () => {
    const allNumbers = new Set();
    const newErrors = [];
    const newFrozenCells = [];
    let isValid = true;

    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell || cell < 1 || cell > 9 || allNumbers.has(cell)) {
          isValid = false;
          newErrors.push({ row: rowIndex, col: colIndex });
        } else {
          allNumbers.add(cell);
          newFrozenCells.push(`${rowIndex}-${colIndex}`);
        }
      });
    });

    setFrozenCells(newFrozenCells); // Freeze correct cells
    if (isValid && allNumbers.size === 9) {
      setCompleted(true);
      setErrors([]);
      setMessage(`🎉 Congratulations! You completed Level ${level} in ${formatTime(elapsedTime)}!`);
    } else {
      setCompleted(false);
      setErrors(newErrors);
      setMessage('❌ Oops! Some numbers are incorrect or repeated. Please correct them.');
    }
  };

  const handleChange = (value, row, col) => {
    if (frozenCells.includes(`${row}-${col}`)) return; // Prevent changes to frozen cells
    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? (parseInt(value) || '') : cell))
    );
    setGrid(newGrid);
    setErrors(errors.filter((error) => error.row !== row || error.col !== col));
  };

  const handleLevelChange = (event) => {
    const selectedLevel = parseInt(event.target.value, 10);
    setLevel(selectedLevel);
    setGrid(generateGrid(selectedLevel));
    setCompleted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setErrors([]);
    setFrozenCells([]);
  };

  const resetGame = () => {
    setGrid(generateGrid(level));
    setCompleted(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    setErrors([]);
    setFrozenCells([]);
  };

  const isError = (row, col) =>
    errors.some((error) => error.row === row && error.col === col);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
  };

  return (
    <div className="App">
  
       <FishIcon className="fish-animation" />
       <FishIcon2 className="fish-animation2" />
       <FishIcon3 className="fish-animation3" />

   <div className="content">   
    <div className="sudoku-container">
   
  <div className="sudoku-grid">
    {/* Sudoku grid goes here */}
  </div>
  <div className="sudoku-info">
   
   { /*<h2>Level: {level}</h2>*/}
    <div className="controls-container">
      <h2>Time: {formatTime(elapsedTime)}</h2>
    </div>
  

    <div className="level-selector">
    <h3>How many spaces <br /><b>do you want to fill?</b><br />🚀</h3>
  <div className="button-container">
    {[...Array(7)].map((_, index) => (
      <button
        key={index}
        onClick={() => handleLevelChange({ target: { value: index + 1 } })}
        className={`level-button ${level === index + 1 ? 'active' : ''}`}
      >
        {index + 1}{index > 0 ? '' : ''}
      </button>
    ))}
  </div>
</div>
      </div>
      <div className={`grid ${completed ? 'completed' : ''}`}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="text"
                value={cell || ''}
                onChange={(e) => handleChange(e.target.value, rowIndex, colIndex)}
                className={`cell ${isError(rowIndex, colIndex) ? 'error' : ''}`}
                disabled={frozenCells.includes(`${rowIndex}-${colIndex}`)} // Disable frozen cells
              />
            ))}
          </div>
        ))}
      </div>

      <div className="controls">
  <button className="mission-check-button" onClick={validateGrid}>Mission Check</button>
  <button className="try-again-button" onClick={resetGame}>Try Again</button>
</div>
      <div className="message-container">
        {message && <p>{message}</p>}
      </div>
    </div>
    </div></div>
  );
}

export default App;

