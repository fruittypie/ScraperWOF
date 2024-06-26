import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RollPictures from './RollPictures';
import GapAnalyzer from './GapAnalyzer';
import SettingsCollapse from './SettingsCollapse';
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
  '1': 13,
  '3': 17,
  '5': 25,
  '10': 60,
  '20': 120,
};

const CurrentGap = () => {
  const dispatch = useDispatch();
  const drawValues = useSelector((state) => state.drawValues.drawValues);
  const [gapResult, setGapResult] = useState({});
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [notificationSent, setNotificationSent] = useState(false);

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
        setNotificationSent(false);
      }
    };
    fetchAndCalculateGaps();
  }, [drawValues]);

  useEffect(() => {
    Object.entries(conditions).forEach(([number, gap]) => {
      if (gapResult[number] === gap) {
        sendNotificationToDiscord(number, gap);
      }
    });
    setNotificationSent(true);
  }, [gapResult, notificationSent]);

  useEffect(() => {
    if (selectedNumber === null) {
      handleSelectNumber('1');
    }
  }, [selectedNumber, gapResult]);

  return (
    <div>
      <div className='col-md-12 number-wrapper-color'>
      <div className="d-flex justify-content-end">
        <span
          style={{ cursor: 'pointer' }}
          aria-controls='settings-collapse'
        >
        </span>
        <SettingsCollapse selectedNumber={selectedNumber} />
      </div>
        <RollPictures onClick={handleSelectNumber} selectedNumber={selectedNumber} />
      <div className='current-gap-container'>
        {Object.entries(gapResult).map(([index, value]) => (
          <p key={index}>gap: {value}</p>
        ))}
        </div>
      </div>
      {selectedNumber !== null && (
        <GapAnalyzer selectedNumber={selectedNumber} gapResult={gapResult} />
      )}
    </div>

  );
};

export default CurrentGap;
