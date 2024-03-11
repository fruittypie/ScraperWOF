import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RollPictures from './RollPictures';
import '../styles/NumberProbabilityCalculator.css'

const apiUrl = process.env.API_URL;

const NumberProbabilityCalculator = () => {
    const [numbers, setNumbers] = useState([]);
    const [count, setCount] = useState(0);
    const [valuePercentages, setValuePercentages] = useState({});

    useEffect(() => {
        
        const fetchNumbers = async () => {
            if(count <= 0) {
                setNumbers([]);
                return; 
            }
          try {
            const response = await axios.get(`${apiUrl}/draws?count=${count}`);
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
        totalCount = Math.max(1, totalCount);
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
            const percentage = (count / totalCount) * 100;
            valuePercentages[value] = Number.isNaN(percentage) ? 0 : percentage;
        }

        return valuePercentages;
    }

    return (
        <div className="col-md-8 game-stats-container">
            <div className="row align-items-center">
                <h2>Statistics</h2>
                <form >
                    <input 
                        type="number"
                        value={count}
                        onChange={handleInputChange}
                    /> 
                </form>
            </div>
            <div>
                <RollPictures />
                <div className="percentages-container">
                    {Object.entries(valuePercentages).map(([value, percentage]) => (
                    <div key={value} className="percentage-item">
                        {percentage.toFixed(2)}%
                    </div>
                    ))}
                </div>
            </div> 
            
        </div>
    );
};

export default NumberProbabilityCalculator;