import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchDrawValues } from '../../state/number/drawValuesSlice';
import '../styles/GapAnalyzer.css';

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

const GapAnalyzer = ({ selectedNumber }) => {
    const dispatch = useDispatch();
    const drawValues = useSelector((state) => state.drawValues.drawValues);
    const [gapOccurrences, setGapOccurrences] = useState({}); 

    useEffect(() => {
        async function fetchDataAndProcess() {
            if (!selectedNumber) return;

            const values = drawValues.map(item => item.value); 
            const gapOccurrences = await findGapOccurrences(values, selectedNumber);

            setGapOccurrences(gapOccurrences);
        }

        fetchDataAndProcess();

    }, [drawValues, selectedNumber]);

    useEffect(() => {
        dispatch(fetchDrawValues());
    }, [dispatch]);

    return (
        <div className="gap-container">
            <div className="title-with-image">
                <h2>Gaps for number {selectedNumber}</h2>
                <div className="number-wrapper-color">
                    <img
                        src={`https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll${selectedNumber}.png`} 
                        alt={`Number ${selectedNumber}`}
                    />
                </div>
            </div>
            <div>                
                <ul>
                    {Object.entries(gapOccurrences).map(([gapLength, occurrence]) => (
                        <li key={gapLength}>Gap: {gapLength}, Occurred: {occurrence} times</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default GapAnalyzer;
