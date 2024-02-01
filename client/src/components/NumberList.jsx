// src/NumberList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LazyLoad from 'react-lazy-load';
import './NumberList.css'



const MAX_NUMBERS = 10000;
const INITIAL_DISPLAY_COUNT = 200;

const NumberList = () => {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/numbers');
        setNumbers(response.data);
      } catch (error) {
        console.error(error);  
      }
    }

    if(!numbers.length) {
      fetchNumbers();
    }
  }, []);

  const loadMore = () => {
    setLoading(true);
    const nextDisplayCount = Math.min(displayCount + INITIAL_DISPLAY_COUNT, MAX_NUMBERS);
    setDisplayCount(nextDisplayCount);
    setLoading(false); 
  };
  
  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', marginLeft: '3rem', marginRight: '3rem'}}>
        {numbers.slice(0, displayCount).map((number) => (
          <LazyLoad key={`${number.timestamp}-${number._id}`} height={150} offset={10}>
            <div style={{ marginRight: '3px', marginLeft: '3px' }}>
              <img className='imageColor' src={`src/pictures/Roll${number.value}.png`} alt={`Number ${number.value}`} />
            </div>
          </LazyLoad>
        ))}
      </div>
  
      {displayCount < MAX_NUMBERS && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={loadMore} disabled={loading}>
            Load More
          </button>
        </div>
      )}
    </>
  );
  
};

export default NumberList;