import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpotsFxn } from '../../../store/spots';
import './Spots.css';

function Spots() {
  const spots = useSelector((state) => state.spot.spots);
  //const newSpot = useSelector((state) => state.spot.newSpot);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getSpotsFxn());
  }, [dispatch]);

  if (!spots) {
    return null;
  }

  const allSpots = Object.values(spots);
  // const allSpotsWithNewSpot = newSpot ? [...allSpots, newSpot] : allSpots;

  //redirects user to spot detail page
  const handleSpotClick = (spotId) => {
    history.push(`/spots/${spotId}`);
  };

  return spots && (
    <div className='spots-container'>
      {Array.isArray(allSpots[0]) && allSpots[0].map((spot) => {
        const avgRating = Number(spot.avgRating) ? Number(spot.avgRating).toFixed(1) : '0';
        return (
            <div className = 'spotCard'>
            <div className='spot' key={spot.id} onClick={() => handleSpotClick(spot.id)}>
                <div className='previewImg'>
                <img className='spot-img' src={spot.previewImage || null} alt={`${spot.name}`} />
                </div>
                <div className='spot-container'>
                <p className='location'>
                    {`${spot.city}, ${spot.state}`}<span className='stars'>★{avgRating}</span>
                </p>
                <p className='spot-name'>{spot.name}</p>
                <p className='price'>
                    <span className='spot-price'>${spot.price}</span> night
                </p>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Spots;
