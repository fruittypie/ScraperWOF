import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLatestNumber } from '../../state/number/numberSlice';

const CurrentNumber = () => {
  const dispatch = useDispatch();
  const latestNumber = useSelector((state) => state.number.latestNumber);
  const loading = useSelector((state) => state.number.loading);
  const error = useSelector((state) => state.number.error);

  useEffect(() => {
    dispatch(fetchLatestNumber());
  }, [dispatch]);
  
  return (
    <div>
      <h2>Latest Number</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {latestNumber && (
        <img className='imageColor' style={{height: '100px', marginBottom: '15px' }} src={`https://luckyrinawaybucket.s3.amazonaws.com/numbers/${latestNumber}button.jpg`} />
      )}
    </div>
  );
};

export default CurrentNumber;
