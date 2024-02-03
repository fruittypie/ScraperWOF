import './App.css';
import React, { useState } from 'react';
import NumberList from './components/NumberList.jsx';
import NumberButtons from './components/NumberButtons.jsx';

function App() {
  const [latestNumber, setLatestNumber] = useState(null);

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
        <NumberButtons latestNumber={latestNumber} />
      </div>
      <div>
        <NumberList setLatestNumber={setLatestNumber} />
      </div>
    </div>
  );
}

export default App;
