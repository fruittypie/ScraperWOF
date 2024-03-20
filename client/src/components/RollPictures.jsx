import '../styles/RollPictures.css'

const RollPictures = ({ onClick, selectedNumber  }) => {

    return (
      
        <div className="image-block">
            <div className="image-wrapper">
                <img                    
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll1.png'} 
                    alt={'Number 1'}
                    onClick={() => onClick('1')}
                    className={selectedNumber === '1' ? 'selected' : ''}
                />
            </div>
            <div className="image-wrapper">
                <img
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll3.png'} 
                    alt={'Number 3'}
                    onClick={() => onClick('3')}
                    className={selectedNumber === '3' ? 'selected' : ''}
                />
            </div>

            <div className="image-wrapper">
                <img
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll5.png'} 
                    alt={'Number 5'}
                    onClick={() => onClick('5')}
                    className={selectedNumber === '5' ? 'selected' : ''}
                />
            </div>
                
            <div className="image-wrapper">
                <img
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll10.png'} 
                    alt={'Number 10'}
                    onClick={() => onClick('10')}
                    className={selectedNumber === '10' ? 'selected' : ''}
                />
            </div>
            <div className="image-wrapper">
                <img
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll20.png'} 
                    alt={'Number 20'}
                    onClick={() => onClick('20')}
                    className={selectedNumber === '20' ? 'selected' : ''}
                />
            </div>
        </div>
  
        
)
}
export default RollPictures;