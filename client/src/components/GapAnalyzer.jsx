import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { fetchAllNumbers } from '../../state/number/AllNumbersSlice';
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
    const allNumbers = useSelector((state) => state.allNumbers.allNumbers);
    const [gapOccurrences, setGapOccurrences] = useState({}); 

    const gapEntries = Object.entries(gapOccurrences);
    const thirdLength = Math.ceil(gapEntries.length / 3);
    const firstThird = gapEntries.slice(0, thirdLength);
    const secondThird = gapEntries.slice(thirdLength, 2 * thirdLength);
    const thirdThird = gapEntries.slice(2 * thirdLength);

    useEffect(() => {
        async function fetchDataAndProcess() {
            if (!selectedNumber || !allNumbers) return;
            const values = allNumbers.map(item => item.value); 
            const gapOccurrences = await findGapOccurrences(values, selectedNumber);

            setGapOccurrences(gapOccurrences);
        }

        fetchDataAndProcess();

    }, [allNumbers, selectedNumber]);

    useEffect(() => {
        dispatch(fetchAllNumbers());
    }, [dispatch]);

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
                                    {firstThird.map(([gapLength, occurrence]) => (
                                        <tr key={gapLength}>
                                            <td>{gapLength}</td> 
                                            <td>{occurrence}</td> 
                                        </tr>
                                    ))}
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
                                    {secondThird.map(([gapLength, occurrence]) => (
                                        <tr key={gapLength}>
                                            <td>{gapLength}</td> 
                                            <td>{occurrence}</td> 
                                        </tr>
                                    ))}
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
                                    {thirdThird.map(([gapLength, occurrence]) => (
                                        <tr key={gapLength}>
                                            <td>{gapLength}</td> 
                                            <td>{occurrence}</td> 
                                        </tr>
                                    ))}
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
