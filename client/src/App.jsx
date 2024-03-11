import './App.css';
import React, { useState } from 'react';
import NumberList from './components/NumberList.jsx';
import CurrentNumber from './components/CurrentNumber.jsx';
import CurrentGap from './components/CurrentGap.jsx';
import NumberProbabilityCalculator from './components/NumberProbabilityCalculator.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [latestNumber, setLatestNumber] = useState(null);
  const [selectedNumbers, setSelectedNumbers] = useState([]); 
  const [activeTab, setActiveTab] = useState('calculator'); // State to track active tab

  return (
    <div className="app-container">
      <div className="row">
      <div className="col-md-5" style={{ backgroundColor: '#343434' }}>
      <nav>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
          <button
            className={`nav-link ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            Gap
          </button>
          <button
            className={`nav-link ${activeTab === 'gap' ? 'active' : ''}`}
            onClick={() => setActiveTab('gap')}
          >
            Calculator
          </button>
        </div>
      </nav>
      <div className="tab-content" id="nav-tabContent">
        <div className={`tab-pane fade ${activeTab === 'calculator' ? 'show active' : ''}`}>
          <CurrentGap />
        </div>
        <div className={`tab-pane fade ${activeTab === 'gap' ? 'show active' : ''}`}>
          <NumberProbabilityCalculator />
        </div>
      </div>
      </div>
      <div className="col-md-7" style={{ backgroundColor: '#343434' }}>
        <CurrentNumber latestNumber={latestNumber} />
        <NumberList setLatestNumber={setLatestNumber} selectedNumbers={selectedNumbers} setSelectedNumbers={setSelectedNumbers} />
      </div>
      </div>

    </div>
  );
}

export default App;
