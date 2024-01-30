// src/NumberList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';

const NumberList = () => {
  const [numbers, setNumbers] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadNumbers();
  }, []);

  const loadNumbers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/numbers');
      const newNumbers = response.data;
      const uniqueNew = newNumbers.filter(n => !numbers.includes(n));
      setNumbers((prevNumbers) => [...prevNumbers, ...uniqueNew]);
      console.log('New Numbers:', newNumbers);
      if (newNumbers.length < 100) {
        setHasMore(false); // Stop loading when no more numbers
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <InfiniteScroll
      dataLength={numbers.length}
      next={loadNumbers}
      hasMore={hasMore}
      loader={<h6>Loading...</h6>}
    >
      {numbers.map((number) => (
        <div key={`${number.timestamp}-${number._id}`}>
          <img src={`../pictures/Roll${number.value}.png`} alt={`Number ${number.value}`} />
        </div>
))}
    </InfiniteScroll>
  );
};

export default NumberList;
