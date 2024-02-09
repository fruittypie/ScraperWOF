const CurrentNumber = ({latestNumber}) => {
    return (
        <div>
          <h2>Latest Number</h2>
          {latestNumber && (
            <img className='imageColor' style={{height: '100px', marginBottom: '15px' }} src={`src/pictures/${latestNumber}button.jpg`} alt={`Number ${latestNumber}`} />
          )}
        </div>
      );
};

export default CurrentNumber;
