const CurrentNumber = ({latestNumber}) => {
    return (
        <div>
          <h2>Latest Number</h2>
          {latestNumber && (
            <img className='imageColor' style={{height: '100px', marginBottom: '15px' }} src={`https://luckyrinawaybucket.s3.amazonaws.com/numbers/${number.value}button.jpg`} />
          )}
        </div>
      );
};

export default CurrentNumber;
