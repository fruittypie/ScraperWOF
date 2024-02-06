import './App.css';
import React, { useState } from 'react';
import NumberList from './components/NumberList.jsx';
import CurrentNumber from './components/CurrentNumber.jsx';
import NumberButtons from './components/NumberButtons.jsx';  // Import NumberButtons

function App() {
  const [latestNumber, setLatestNumber] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);  // Add selectedNumber state

  const handleToggle = (numbers) => {
    setSelectedNumbers(numbers);
  };
  
  return (
    <div className="App">
      <header>
        <div>
          <h1>
            Number History
          </h1>
        </div>
      </header>
      <div>
        <NumberButtons handleToggle={handleToggle} />
      </div>
      <div>
        <CurrentNumber latestNumber={latestNumber} />
      </div>
      <div>
        <NumberList setLatestNumber={setLatestNumber} selectedNumbers={selectedNumbers} setSelectedNumbers={setSelectedNumbers} />
      </div>
    </div>
  );
}

export default App;

