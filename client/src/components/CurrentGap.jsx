import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RollPictures from './RollPictures';
import GapAnalyzer from './GapAnalyzer';
import { fetchDrawValues } from '../../state/number/drawValuesSlice';
import '../styles/CurrentGap.css';
import axios from 'axios';

async function calculateGaps(nums) {
  const uniqueNums = ['1', '3', '5', '10', '20'];
  let gapResults = { '1': Infinity, '3': Infinity, '5': Infinity, '10': Infinity, '20': Infinity };

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i].value;
    for (const uniqueNum of uniqueNums) {
      if (num == uniqueNum) {
        gapResults[uniqueNum] = Math.min(gapResults[uniqueNum], i);
      }
    }
  }
  return gapResults;
}

const sendNotificationToDiscord = async (number, gap) => {
  try {
    const webhookUrl = process.env.WEBHOOK_URL;

    const message = {
      content: `Number ${number} has a gap of ${gap}!`,
    };
    await axios.post(webhookUrl, message);
  } catch (error) {
    console.error('Error sending notification to Discord:', error);
  }
};

const conditions = {
  '1': 12,
  '3': 15,
  '5': 25,
  '10': 60,
  '20': 120,
};

const CurrentGap = () => {
  const dispatch = useDispatch();
  const drawValues = useSelector((state) => state.drawValues.drawValues);
  const [gapResult, setGapResult] = useState({});
  const [sentNotifications, setSentNotifications] = useState({});
  const [selectedNumber, setSelectedNumber] = useState(null);
  
  const handleSelectNumber = (number) => {
    setSelectedNumber(number); 
  };

  useEffect(() => {
    dispatch(fetchDrawValues(200));
  }, [dispatch]);

  useEffect(() => {
    const fetchAndCalculateGaps = async () => {
      if (drawValues) {
        const calculatedGapResult = await calculateGaps(drawValues);
        setGapResult(calculatedGapResult);
      }
    };
    fetchAndCalculateGaps();
  }, [drawValues]);

  useEffect(() => {
    // Check conditions based on counts
    Object.entries(conditions).forEach(([number, gap]) => {
      if (gapResult[number] === gap && !sentNotifications[`${number}-${gap}`]) {
        sendNotificationToDiscord(number, gap);
        setSentNotifications((prevSentNotifications) => ({
          ...prevSentNotifications,
          [`${number}-${gap}`]: true,
        }));
      }
    });
  }, [gapResult, sentNotifications]);

  useEffect(() => {
    return () => {
      setSentNotifications({});
    };
  }, []);

  return (
    <div>
      <div className='col-md-8 number-wrapper-color'>
        <RollPictures onClick={handleSelectNumber} />
        <div className='current-gap-container'>
          {Object.entries(gapResult).map(([index, value]) => (
            <p key={index}>gap: {value}</p>
          ))}
        </div>
      </div>
      {selectedNumber !== null && (
        <GapAnalyzer selectedNumber={selectedNumber} />
      )}
    </div>
    
  );
};

export default CurrentGap;
