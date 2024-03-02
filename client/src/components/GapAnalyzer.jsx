import axios from 'axios';
import React, { useState, useEffect } from 'react';

async function findGapOccurrences(arr, num) {
    let currentGap = 0;
    const gapOccurrences = {}; 

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === num) {
            if (currentGap > 0) {
                if (gapOccurrences[currentGap]) {
                    gapOccurrences[currentGap]++;
                } else {
                    gapOccurrences[currentGap] = 1;
                }
                currentGap = 0;
            }
        } else {
            currentGap++;
        }
    }

    return gapOccurrences;
}

const GapAnalyzer = () => {
    const [count, setCount] = useState(0);
    const [gapOccurrences, setGapOccurrences] = useState({});

    const targetNumbers = ['1', '3', '5', '10', '20'];

    const handleInputChange = (event) => {
        setCount(event.target.value); 
    };

    useEffect(() => {
        async function fetchDataFromBackend() {
            try {
                const response = await axios.get(`http://localhost:3000/api/draws?count=${count}`);
                return response.data;
            } catch (error) {
                throw new Error('Error fetching data from backend:', error);
            }
        }

        async function fetchDataAndProcess() {
            const responseData = await fetchDataFromBackend();
            const targetGapOccurrences = {};

            for (const targetNumber of targetNumbers) {
                const values = responseData.map(item => item.value); 
                const gapOccurrences = await findGapOccurrences(values, targetNumber);
                targetGapOccurrences[targetNumber] = gapOccurrences;
            }

            setGapOccurrences(targetGapOccurrences);
        }

        fetchDataAndProcess();
    }, [count]); 

    return (
        <div>
            <h2>Gap of non-occurrences</h2>
            <form>
                <input 
                    type="number"
                    value={count}
                    onChange={handleInputChange}
                /> 
            </form>
            <div>
                {/* Display the gap occurrences */}
                {Object.entries(gapOccurrences).map(([targetNumber, occurrences]) => (
                    <div key={targetNumber}>
                        <h3>number {targetNumber}:</h3>
                        <ul>
                            {Object.entries(occurrences).map(([gapLength, occurrence]) => (
                                <li key={gapLength}>Gap: {gapLength}, Occurred: {occurrence} times</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GapAnalyzer;
