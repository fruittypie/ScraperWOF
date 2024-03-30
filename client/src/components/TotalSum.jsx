import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../../state/settings/settingsData';
import { OuterClick } from 'react-outer-click';
import '../styles/TotalSum.css';


const TotalSum = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState('1000');
  const [total, setTotal] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const savedTotal = localStorage.getItem('total');
    if (savedTotal) {
      setTotal(savedTotal);
      setValue(savedTotal);
    } else {
      setTotal('1000');
    }
  }, []);

  const dispatch = useDispatch();

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    setIsEditing(false);
    setTotal(value);
    dispatch(setFormData({ total: value }));
    localStorage.setItem('total', value);
  };


  const handleClickOutside = () => {
    if (isEditing) {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <OuterClick onOuterClick={handleClickOutside}>
        <span style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
        {isEditing ? (
            <form onSubmit={handleSubmit} className="d-flex align-items-center">
            <input type="text" style={{ backgroundColor: '#C8CCCE', width: '70px', marginBottom: '3px', marginRight: '3px' }} 
              className="form-control form-control-sm" 
              placeholder="Total" 
              ref={inputRef}
              value={value} 
              onChange={handleChange} 
            />
            </form>
        ) : (
            <h5 onClick={handleClick} style={{ color: '#C8CCCE' }}>
            <img
            src={'https://luckyrinawaybucket.s3.amazonaws.com/items/scrap.png'} 
            alt={'scrapIcon'}
            className='scrap-icon'
            />
            {total}
        </h5>
        )}
        </span>
    </OuterClick>
  );
};

export default TotalSum;
