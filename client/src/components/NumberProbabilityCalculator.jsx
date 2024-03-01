import React, { useState } from 'react';
import axios from 'axios';


const NumberProbabilityCalculator = () => {
    const [drawCount, setDrawCount] = useState(0);
    const [drawStats, setDrawStats] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setDrawCount(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
       
        if (drawCount !== 0) {
          fetchDrawValues();
        }
    };

    const fetchDrawValues = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/draws?count=${drawCount}`);
            calculateDrawStats(response.data)
        } catch (error) {
            console.error('Error fetching draw values:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateDrawStats = (draws) => {
        const nums = {
            '1' : 0,
            '3' : 0,
            '5' : 0,
            '10' : 0,
            '20' : 0,
        };

        draws.forEach((draw) => {
            nums[draw] += 1;
        });

        const totalRangeCount = draws.length;

        const numberFrequencies = Object.fromEntries(
            Object.entries(nums).map(([key,value]) => [
                key,
                ((value / totalRangeCount) * 100).toFixed(2),
            ])
        );

        setDrawStats(numberFrequencies);
    };


    
    return (
        <div className="col-md-8 game-stats-container">
            <h2>Statistics</h2>
            <form onSubmit={handleSubmit} >
                <input 
                    type="number"
                    value={drawCount}
                    onChange={handleInputChange}
                />
            </form>
            <button type="submit">Calculate</button>
            {loading ? (
                <p>Wait...</p>
            ) : (
                <div>
                    {Object.entries(drawStats).map(([value, percentage]) => (
                        <div key={value} className="number-item">
                            <img
                                src={`https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll${value}.png`}
                                alt={`Number ${value}`}
                            />
                            <p>{percentage}%</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NumberProbabilityCalculator;