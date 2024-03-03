import axios from 'axios';
import { useState, useEffect } from 'react';

const apiUrl = process.env.API_URL;

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
    const [loading, setLoading] = useState(false);

    const targetNumbers = ['1', '3', '5', '10', '20'];

    const handleInputChange = (event) => {
        setCount(event.target.value); 
    };

    useEffect(() => {
        async function fetchDataFromBackend() {
            setLoading(true);
            try {
                const response = await axios.get(`${apiUrl}/draws?count=${count}`);
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
            setLoading(false);
        }

        fetchDataAndProcess();
    }, [count]); 

    useEffect(() => {
        setCount(70000);
    }, []);

    return (
        <div>
            <h2>Gaps</h2>
            <form>
                <input 
                    type="number"
                    value={count}
                    onChange={handleInputChange}
                /> 
            </form>
            {loading && <p>Loading...</p>} 
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
