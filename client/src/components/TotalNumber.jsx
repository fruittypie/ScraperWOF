import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTotalNumber } from '../../state/number/totalNumSlice';
import '../styles/CurrentNumber.css';


const TotalNumber = () => {
  const dispatch = useDispatch();
  const totalNumber = useSelector((state) => state.totalNum.totalNumber);

  useEffect(() => {
    dispatch(fetchTotalNumber())
  }, [dispatch]);
  
  return (
    <div className="total-number">
        <h6>
          {`Total number in db: ${totalNumber}`}
        </h6>
    </div>
  );
};

export default TotalNumber;
