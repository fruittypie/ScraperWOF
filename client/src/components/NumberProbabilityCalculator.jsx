import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RollPictures from './RollPictures';


const NumberProbabilityCalculator = () => {
    const [numbers, setNumbers] = useState([]);
    const [count, setCount] = useState(0);

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
 
    const handleInputChange = (event) => {
        setCount(event.target.value);
    };

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
                {numbers.map((number) => (
                    number.value
                ))}

            </div>
            
        </div>
    );
};

export default NumberProbabilityCalculator;