// src/NumberList.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLatestNumber } from '../../state/number/numberSlice';
import { fetchTotalNumber } from '../../state/number/totalNumSlice';
import { fetchDrawValues } from '../../state/number/drawValuesSlice';

import axios from 'axios';
import LazyLoad from 'react-lazy-load';
import { io } from 'socket.io-client';
import '../styles/NumberList.css';


const MAX_NUMBERS = 10000;
const INITIAL_DISPLAY_COUNT = 500;

const apiUrl = process.env.API_URL;
const hostUrl = process.env.HOST_URL;


const NumberList = ({ selectedNumbers, setSelectedNumbers }) => {
  const dispatch = useDispatch();

  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [startIndex, setStartIndex] = useState(null);
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  let initialIndex = -1;

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const response = await axios.get(`${apiUrl}/draws?count=2000`);
        setNumbers(response.data);

      } catch (error) {
        console.error(error);  
      }
    };

    const socket = io(`${hostUrl}`);

    // Listen for the 'newNumber' event
    socket.on('newNumber', (newNumber) => {
      setNumbers((prevNumbers) => {
        const updatedNumbers = [newNumber, ...prevNumbers.slice(0, MAX_NUMBERS - 1)];
        return updatedNumbers;
      });

      dispatch(setLatestNumber(newNumber.value));
      dispatch(fetchTotalNumber());
      dispatch(fetchDrawValues(200));
    });

    fetchNumbers();

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const loadMore = () => {
    setLoading(true);
    const nextDisplayCount = Math.min(displayCount + INITIAL_DISPLAY_COUNT, MAX_NUMBERS);
    setDisplayCount(nextDisplayCount);
    setLoading(false); 
  };
  
  const handleImageClick = (number, index) => {
    if (selectedNumbers.length === 4) {
      // Clear the selected range if four numbers are already selected
      setSelectedNumbers([]);
    } else {
      if (selectedNumbers.includes(number)) {
        // If the number is already in the array, remove it
        setSelectedNumbers((prevSelectedNumbers) =>
          prevSelectedNumbers.filter((num) => num !== number)
        );
      } else {
        // If the number is not in the array, add it
        setSelectedNumbers((prevSelectedNumbers) => [...prevSelectedNumbers, number]);
        console.log(`Clicked image with value ${number} at index ${index}`);
      }
    }
  };

  const handleImageMouseDown = (index) => {
    initialIndex = index;
    setIsMouseDown(true)
    setStartIndex(index);
  }

  const handleImageMouseUp = (e, index) => {
    if (e.target.tagName !== 'IMG') {
      setStartIndex(null);
      setIsMouseDown(false);
      setSelectedValues([]);
    } else {
      // Mouse released on the image
      setIsMouseDown(false);

      // Get an array of values for selected indexes
      const selectedValues = selectedIndexes.map(index => numbers[index]);

      // Log the array of selected values
      console.log("Selected Values:", selectedValues);
    }
  };
  
  const handleMouseMove = (index) => {
    if (isMouseDown) {
    const start = Math.min(startIndex, index);
    const end = Math.max(startIndex, index);
    
    setSelectedIndexes(
      Array.from({length: end - start + 1}, (_, i) => start + i) 
    );
    }
  }
  
  return (
    <>
        <div
          className='numbers-list-container'>
          {numbers.slice(0, displayCount).map((number, index) => (
            <LazyLoad key={`${number._id}`} height={50} offset={10}>
              <div style={{ marginRight: '3px', marginLeft: '3px' }}>
                  <img
                    className={`
                    ${selectedNumbers.length === 0 || selectedNumbers.includes(number.value) ? 'imageColor' : 'imageColor clicked'}
                    ${isMouseDown  && selectedIndexes.includes(index) ? 'imageColor selected' : 'imageColor'} 
                  `}
                    src={`https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll${number.value}.png`}
                    alt={`Number ${number.value}`}
                    onClick={() => handleImageClick(number.value, index)}
                    onMouseMove={() => {
                      if (isMouseDown) {
                        handleMouseMove(index); 
                      }
                    }}
                    onMouseDown={() => {
                      setIsMouseDown(true);
                      handleImageMouseDown(index);
                    }}
                    onMouseUp={(e) => handleImageMouseUp(e, index)}
                    draggable="false"
                  />

              </div>
            </LazyLoad>
          ))}
        </div>
         
  
      {displayCount < MAX_NUMBERS && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="button" className="btn btn-secondary btn-sm load-btn" onClick={loadMore} disabled={loading}>
            Load More
          </button>
        </div>
      )}
    </>
  );
};

export default NumberList;