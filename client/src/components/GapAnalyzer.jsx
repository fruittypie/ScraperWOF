import { useState, useEffect } from 'react';
import chroma from 'chroma-js';
import '../styles/GapAnalyzer.css';
import axios from 'axios';

const apiUrl = process.env.API_URL;

function calculateGameStrategy(totalSum, number) {
    let numberInt = Number(number);
    let currentBet = 1;
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

    const calculateColor = (profit, selectedNumber) => {
      if (profit === null) return; // Default color for dash with 0.1 opacity
  
      const colorMap = {
        '1': '#feff01',    // Yellow for selectedNumber '1'
        '3': '#18a318',     // Green for selectedNumber '3'
        '5': '#327aac',     // Blue for selectedNumber '5'
        '10': '#a207a2',   // Violet for selectedNumber '10'
        '20': '#ffa500'    // Orange for selectedNumber '20'
    };

      const selectedColor = colorMap[selectedNumber.toString()] || 'turquoise';

      const maxProfit = Math.max(...betData.map(data => data.profit));
      const minProfit = Math.min(...betData.map(data => data.profit));
      const range = maxProfit - minProfit;

      if (range == 0 || profit == 0) {
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
      if (selectedNumber !== undefined && selectedNumber !== null) {
          const data = calculateGameStrategy(1000, selectedNumber);
          setBetData(data.reverse());
      }
  }, [selectedNumber]);

  const highlightColor = getHighlightColor(selectedNumber);

  const selectedNumberGap = findGapByNumber(selectedNumber);
  const gapEntries = Object.entries(selectedNumberGap).reverse(); // Reverse the gapEntries array

  const combinedData = gapEntries.map(([gapLength, occurrence], index) => ({
      gapLength,
      occurrence,
      betInfo: betData[index] || null,
  })).reverse();

    // Divide the combined array into three parts
    const thirdLength = Math.ceil(combinedData.length / 3);
    const firstThird = combinedData.slice(0, thirdLength);
    const secondThird = combinedData.slice(thirdLength, 2 * thirdLength);
    const thirdThird = combinedData.slice(2 * thirdLength);

    return (
        <div className="mask d-flex align-items-center h-100">
            <div className="gap-container">
                <div className="row justify-content-center">
                    {[firstThird, secondThird, thirdThird].map((third, index) => (
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
                                        {third.map(({ gapLength, occurrence, betInfo }) => (
                                            <tr key={gapLength} className='no-border' >
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