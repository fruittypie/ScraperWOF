import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RollPictures from './RollPictures';
import { fetchDrawValues } from '../../state/number/drawValuesSlice';
import '../styles/CurrentGap.css'


function calculateGaps(values) {
    const gapResults = {};
  
    for (let i = 0; i < values.length; i++) {
      const num = values[i].value;
  
      if (!gapResults[num]) {
        gapResults[num] = i;
      }
    }
    return gapResults;
}

const CurrentGap = () => {
    const dispatch = useDispatch();
    const drawValues = useSelector((state) => state.drawValues.drawValues);

    useEffect(() => {
        dispatch(fetchDrawValues(200));
    }, [dispatch]);

    const gapResults = calculateGaps(drawValues || []);

    return (
        <div className='col-md-8 number-wrapper-color'>
            <RollPictures />
            <div className='current-gap-container'>
                {Object.keys(gapResults).map((value, index) => (
                    <p key={index}>gap: {value}</p>
                ))}
            </div>
        </div>
    );
};

export default CurrentGap;
