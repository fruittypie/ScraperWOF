import './App.css';
import React, { useState } from 'react';
import NumberList from './components/NumberList.jsx';
import CurrentNumber from './components/CurrentNumber.jsx';
import CurrentGap from './components/CurrentGap.jsx';
import GapAnalyzer from './components/GapAnalyzer.jsx';
import NumberProbabilityCalculator from './components/NumberProbabilityCalculator.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [latestNumber, setLatestNumber] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]);  // Add selectedNumber state
  
  return (
  <div className="row">
    <div className="col-md-8">
      <div className="row">
        <div className="col-md-6" style={{ height: '25vh', backgroundColor: '#343434' }}>
        <div className="row justify-content-center">         
          <NumberProbabilityCalculator />   
        </div>
        </div>
        <div className="col-md-6" style={{ height: '25vh', backgroundColor: '#343434' }} >
          <CurrentNumber latestNumber={latestNumber} />
        </div>
      </div>
      <div className="row">   
        <div className="col-md-12" style={{ backgroundColor: '#343434' }}>
          <NumberList setLatestNumber={setLatestNumber} selectedNumbers={selectedNumbers} setSelectedNumbers={setSelectedNumbers} />
        </div>
      </div>
    </div>
    <div className="col-md-4" style={{ backgroundColor: '#343434' }}>
      <CurrentGap />
    </div>
  </div>
  );
}

export default App;
