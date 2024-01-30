import './App.css';
import React from 'react';
import NumberList from './components/NumberList.jsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>
            Number History
          </h1>
          <NumberList />
        </div>
      </header>
    </div>
  );
}

export default App;
