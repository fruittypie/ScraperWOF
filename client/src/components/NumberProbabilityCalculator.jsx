import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RollPictures from './RollPictures';


const NumberProbabilityCalculator = () => {
    const [numbers, setNumbers] = useState([]);
    const [count, setCount] = useState(0);
    const [valuePercentages, setValuePercentages] = useState({});

    useEffect(() => {
        const fetchNumbers = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/api/draws?count=${count}`);
            setNumbers(response.data);
          } catch (error) {
            console.error(error);  
          }
        };

        fetchNumbers();
    }, [count]);

    useEffect(() => {
        const percentages = countValues(numbers, count);
        setValuePercentages(percentages);
    }, [numbers]);
 
    const handleInputChange = (event) => {
        setCount(event.target.value);
    };

    const countValues = (numbers, totalCount) => {
        const valueCounts = {
            '1' : 0,
            '3' : 0,
            '5' : 0,
            '10' : 0,
            '20' :0
        };

        numbers.forEach((number) => {
            const value = number.value;    
            valueCounts[value]++;
  
        });

        const valuePercentages = {};
        for (const [value, count] of Object.entries(valueCounts)) {
            valuePercentages[value] = (count / totalCount) * 100;
            console.log('count is ', count );
            console.log('totalCount is ', totalCount );
            console.log('valuePercentages is ', valuePercentages );
        }

        return valuePercentages;
    }

    return (
        <div className="col-md-8 game-stats-container">
            <h2>Statistics</h2>
            <form >
                <input 
                    type="number"
                    value={count}
                    onChange={handleInputChange}
                /> 
                <button type="submit">Calculate</button>
            </form>
            <div>
                <RollPictures />
                <div className="percentages-container">
                    {Object.entries(valuePercentages).map(([value, percentage]) => (
                        <div key={value} className="percentage-item">
                        <div className="percentage-bar">
                            <div className="fill" style={{ width: `${percentage}%` }}></div>
                        </div>
            <div className="percentage">{percentage.toFixed(2)}%</div>
        </div>
    ))}
</div>

            </div>
            
        </div>
    );
};

export default NumberProbabilityCalculator;