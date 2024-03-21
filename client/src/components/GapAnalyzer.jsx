import { useState, useEffect } from 'react';
import '../styles/GapAnalyzer.css';
import axios from 'axios';

const apiUrl = process.env.API_URL;

function calculateGameStrategy(totalSum, selectedNumber, currentBet) {
    let moneySpent = 0;
    let roundNumber = 1;
    let betMultiplier = 0;

    // Set betMultiplier based on selectedNumber
    switch (selectedNumber) {
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
  
    while (moneySpent < totalSum) {
      const potentialWin = currentBet * betMultiplier;
      const potentialProfit = potentialWin - (moneySpent + currentBet);
  
      if (potentialProfit <= 0) {
        currentBet+= 1;
      } else {
        const roundInfo = {
          round: roundNumber,
          bet: currentBet,
          totalSpent: moneySpent + currentBet,
          win: potentialWin,
          profit: potentialProfit
        };
  
        betData.push(roundInfo);
        moneySpent += currentBet;
        roundNumber++;
        currentBet = 1;
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
        // Check if the current key is missing
        if (!(i in gapObject.gap)) {
          gapObject.gap[i] = 0;
        }
      }
      // Sort in ascending order
      gapObject.gap = Object.fromEntries(Object.entries(gapObject.gap).sort(([a], [b]) => a - b));
    }
    return combinedGapResults;
  };

  const GapAnalyzer = ({ selectedNumber, gapResult }) => {
    const [gapOccurrences, setGapOccurrences] = useState({});
    const [betData, setBetData] = useState([]);

    const findGapByNumber = (number) => {
        const entry = Object.values(gapOccurrences).find(
          (entry) => entry.number == Number(number)
        );
        return entry ? entry.gap : {};
    };

    const selectedNumberGap = findGapByNumber(selectedNumber);
    const gapEntries = Object.entries(selectedNumberGap);
    
    const thirdLength = Math.ceil(gapEntries.length / 3);
    const firstThird = gapEntries.slice(0, thirdLength);
    const secondThird = gapEntries.slice(thirdLength, 2 * thirdLength);
    const thirdThird = gapEntries.slice(2 * thirdLength);

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
        const gameData = calculateGameStrategy(1000, selectedNumber, 1);
        setRoundData(gameData);
    }, [selectedNumber]);

    const highlightColor = getHighlightColor(selectedNumber);

    return (
        <div className="mask d-flex align-items-center h-100">
            <div className="gap-container">
                <div className="row justify-content-center">
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-dark table-bordered mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">GAP</th>
                                        <th scope="col">TIMES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {firstThird.map(([gapLength, occurrence]) => {
                                        return (
                                            <tr key={gapLength} className={gapLength == gapResult[selectedNumber] ? `highlight-${highlightColor}` : ''}>
                                                <td>{gapLength}</td> 
                                                <td>{occurrence}</td> 
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-dark table-bordered mb-0 ">
                                <thead>
                                    <tr>
                                        <th scope="col">GAP</th>
                                        <th scope="col">TIMES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {secondThird.map(([gapLength, occurrence]) => {
                                        return (
                                            <tr key={gapLength} className={gapLength == gapResult[selectedNumber] ? `highlight-${highlightColor}` : ''}>
                                                <td>{gapLength}</td> 
                                                <td>{occurrence}</td> 
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col">
                        <div className="table-responsive">
                            <table className="table table-dark table-bordered mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">GAP</th>
                                        <th scope="col">TIMES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {thirdThird.map(([gapLength, occurrence]) => {
                                        return (
                                            <tr key={gapLength} className={gapLength == gapResult[selectedNumber] ? `highlight-${highlightColor}` : ''}>
                                                <td>{gapLength}</td> 
                                                <td>{occurrence}</td> 
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GapAnalyzer;