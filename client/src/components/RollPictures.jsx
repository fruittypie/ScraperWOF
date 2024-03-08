import '../styles/RollPictures.css'

const RollPictures = ({ onClick }) => {

    return (
      
        <div className="image-block">
            <div className="image-wrapper">
                <img                    
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll1.png'} 
                    alt={'Number 1'}
                    onClick={() => onClick('1')}
                />
            </div>
            <div className="image-wrapper">
                <img
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll3.png'} 
                    alt={'Number 3'}
                    onClick={() => onClick('3')}
                />
            </div>

            <div className="image-wrapper">
                <img
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll5.png'} 
                    alt={'Number 5'}
                    onClick={() => onClick('5')}
                />
            </div>
                
            <div className="image-wrapper">
                <img
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll10.png'} 
                    alt={'Number 10'}
                    onClick={() => onClick('10')}
                />
            </div>
            <div className="image-wrapper">
                <img
                    src={'https://luckyrinawaybucket.s3.amazonaws.com/colors/Roll20.png'} 
                    alt={'Number 20'}
                    onClick={() => onClick('20')}
                />
            </div>
            
        </div>
  
        
)
}
export default RollPictures;