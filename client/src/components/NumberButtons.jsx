
import React, { useState } from 'react';

const NumberButtons = ({ handleToggle }) => {
  
  const numbers = ['1', '3', '5', '10', '20'];

  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const toggleNumber = (number) => {
    const updatedNumbers = [...selectedNumbers];

    if (updatedNumbers.includes(number)) {
      // Remove number if already selected
      const index = updatedNumbers.indexOf(number);
      updatedNumbers.splice(index, 1);
    } else {
      // Add number if not selected
      updatedNumbers.push(number);
    }

    setSelectedNumbers(updatedNumbers);
    handleToggle(updatedNumbers);
  };

  return (
    <div>
      {numbers.map((number) => (
        <button
          key={number}
          onClick={() => toggleNumber(number)}
          style={{ opacity: selectedNumbers.includes(number) ? 1 : 0.3 }}
        >
          <img
            className='imageButton'
            style={{ height: '80px', marginBottom: '15px' }}
            src={`src/pictures/${number}button.jpg`}
            alt={`Number ${number}`}
          />
        </button>
      ))}
    </div>
  );
};

export default NumberButtons;
