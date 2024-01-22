import './App.css';
import React from 'react';
import NumberList from './NumberList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>
            Number History
            <NumberList />
          </h1>
        </div>
      </header>
    </div>
  );
}

export default App;
