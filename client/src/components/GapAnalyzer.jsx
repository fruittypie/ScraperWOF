import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import chroma from 'chroma-js';
import '../styles/GapAnalyzer.css';
import axios from 'axios';

const apiUrl = process.env.API_URL;

function calculateGameStrategy(bet, totalSum, number, mode) {

    let currentBet = Number(bet);
    let numberInt = Number(number);
    let moneySpent = 0;
    let roundNumber = 1;
    let betMultiplier = 0;

    // Set betMultiplier based on number
    switch (numberInt) {
        case 1:
            betMultiplier = 2;
            break;
        case 3:
            betMultiplier = 4;
            break;
        case 5:
            betMultiplier = 6;
            break;
        case 10:
            betMultiplier = 11;
            break;
        case 20:
            betMultiplier = 21;
            break;
    }

    const betData = [];

    while (moneySpent + currentBet <= totalSum) {
      const potentialWin = currentBet * betMultiplier;
      const potentialProfit = potentialWin - (moneySpent + currentBet);

      if ((mode === 'safe' && parseFloat(potentialProfit.toFixed(2)) < 0) || 
        (mode === 'risky' && parseFloat(potentialProfit.toFixed(2)) <= 0)) 
      {
        currentBet+= Number(bet);
      } else {
        const roundInfo = {
          round: roundNumber,
          bet:parseFloat(currentBet.toFixed(2)),
          totalSpent: moneySpent + currentBet,
          win: potentialWin,
          profit: parseFloat(potentialProfit.toFixed(2))
      };

        betData.push(roundInfo);
        moneySpent += currentBet;
        roundNumber++;
        currentBet = Number(bet);
      }
    }
    return betData;
}

const getHighlightColor = (selectedNumber) => {
    switch (selectedNumber) {
      case '1':
        return 'yellow';
      case '3':
        return 'green';
      case '5':
        return 'blue';
      case '10':
        return 'violet';
      case '20':
        return 'orange';
      default:
        return 'yellow';
    }
};

const fillMissingGaps = (combinedGapResults) => {
  // Iterate over each gap object
    for (const gapObject of Object.values(combinedGapResults)) {
      const maxGapKey = Math.max(...Object.keys(gapObject.gap).map(Number));
      for (let i = 1; i <= maxGapKey; i++) {
        //Check if the current key is missing
        if (!(i in gapObject.gap)) {
          gapObject.gap[i] = 0;
        }
      }
      //Sort in ascending order
      gapObject.gap = Object.fromEntries(Object.entries(gapObject.gap).sort(([a], [b]) => a - b));
    }
    return combinedGapResults;
};

const GapAnalyzer = ({ selectedNumber, gapResult }) => {
  const [gapOccurrences, setGapOccurrences] = useState({});
  const [betData, setBetData] = useState([]);
  const [extraEntries, setExtraEntries] = useState([]);
  const formData = useSelector((state) => state.form);

  const calculateColor = (profit, selectedNumber) => {
    if (profit === null) return;

    const colorMap = {
      '1': '#feff01',    
      '3': '#18a318',     
      '5': '#327aac',     
      '10': '#a207a2',   
      '20': '#ffa500' 
  };

    const selectedColor = colorMap[selectedNumber.toString()] || 'turquoise';

    const maxProfit = Math.max(...betData.map(data => data.profit));
    const minProfit = Math.min(...betData.map(data => data.profit));
    const range = maxProfit - minProfit;

    if (range == 0) {
      return selectedColor;
  }
    // Calculate normalized profit value
    const normalizedProfit = (profit - minProfit) / range;

    // Interpolate color using chroma.js
    const interpolatedColor = chroma.scale(['rgb(255, 255, 255)', selectedColor]).mode('rgb')(normalizedProfit);

    // Convert chroma color object to rgba string with opacity
    return interpolatedColor.alpha(0.1 + 0.9 * normalizedProfit).css();
  };

  const findGapByNumber = (number) => {
      const entry = Object.values(gapOccurrences).find(
          (entry) => entry.number === Number(number)
      );
      return entry ? entry.gap : {};
  };



  useEffect(() => {
      const fetchGapOccurrences = async () => {
          try {
              const response = await axios.get(`${apiUrl}/recalculate`);
              const data = response.data;
              const updatedData = fillMissingGaps(data);
              setGapOccurrences(updatedData);
          } catch (error) {
              console.error('Error fetching gap occurrences:', error);
          }
      };

      fetchGapOccurrences();
  }, [gapResult]);


  useEffect(() => {
    if (selectedNumber !== undefined && selectedNumber !== null && formData) {
      // Retrieve totalSum and mode from formData, or use defaults if they are not available
      const total = formData.total || 1000;
      const mode = formData.mode || 'safe';
      const bet = formData.bet || 1;
      const data = calculateGameStrategy(bet, total, selectedNumber, mode);
      setBetData(data.reverse());
      }    
  }, [selectedNumber, formData]);

  const highlightColor = getHighlightColor(selectedNumber);

  const selectedNumberGap = findGapByNumber(selectedNumber);
  const gapEntries = Object.entries(selectedNumberGap);

  const isMobileScreen = () => {
    return window.innerWidth <= 768; 
  };

  const addExtraEntries = (number) => {
    const newEntries = [];
    for (let i = 0; i < number; i++) {
      newEntries.push([ i + 1, 0 ]);
    }
    return newEntries;
  };

 useEffect(() => {
  if (formData?.skipSteps !== undefined) {
    const stepCount = parseInt(formData.skipSteps);
    const newExtraEntries = addExtraEntries(stepCount);
    setExtraEntries(newExtraEntries); 
  }
}, [formData.skipSteps]);

  const addedEntries = [...gapEntries, ...extraEntries];
  const combinedData = addedEntries.reverse().map((entry, index) => ({
    gapLength: entry[0],
    occurrence: entry[1],
    betInfo: betData[index] || null,
  })).reverse();

  let tableParts;
  if (isMobileScreen()) {
    // Divide the combined array into two parts for mobile screens
    const halfLength = Math.ceil(combinedData.length / 2);
    const firstPart = combinedData.slice(0, halfLength);
    const secondPart = combinedData.slice(halfLength);
    tableParts = [firstPart, secondPart];
  } else {
    // Divide the combined array into three parts for non-mobile screens
    const thirdLength = Math.ceil(combinedData.length / 3);
    const firstThird = combinedData.slice(0, thirdLength);
    const secondThird = combinedData.slice(thirdLength, 2 * thirdLength);
    const thirdThird = combinedData.slice(2 * thirdLength);
    tableParts = [firstThird, secondThird, thirdThird];
  }

  return (
      <div className="mask d-flex align-items-center h-100">
          <div className="gap-container">
              <div className="row justify-content-center">
              {tableParts.map((part, index) => (
                      <div key={index} className="col">
                          <div className="table-responsive">
                            <table className="table table-dark table-bordered mb-0">
                              <thead>
                                  <tr>
                                      <th scope="col">GAP</th>
                                      <th scope="col">TIMES</th>
                                      <th scope="col">BET</th>
                                      <th scope="col">$</th>
                                  </tr>
                              </thead>
                              <tbody>
                                {part.map(({ gapLength, occurrence, betInfo }) => (
                                  <tr key={`${gapLength}+${index}`} className='no-border' >
                                      <td className={gapLength == gapResult[selectedNumber] ? `highlight-${highlightColor}` : 'border-table'}>{gapLength}</td>
                                      <td className={gapLength == gapResult[selectedNumber] ? `highlight-${highlightColor}` : 'border-table'}>{occurrence}</td>
                                      <td className={gapLength == gapResult[selectedNumber] ? `highlight-${highlightColor}` : 'border-table'}>{betInfo ? betInfo.bet : '-'}</td>
                                      <td className="border-end-0" style={{ color: '#212529', backgroundColor: calculateColor(betInfo ? betInfo.profit : null, selectedNumber) }}>{betInfo ? betInfo.profit : '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );
};

export default GapAnalyzer;

