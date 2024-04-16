import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpotsFxn } from '../../../store/spots';
import placeholderImg from '../../../../src/images/placeholder.jpg';
import './Spots.css';

function Spots() {
  const spots = useSelector((state) => Object.values(state.spot.spots));
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(getSpotsFxn());
  }, [dispatch]);

  if (!spots) {
    return null;
  }

  const handleSpotClick = (spotId) => {
    history.push(`/spots/${spotId}`);
  };

  return spots && (
    <div className='spots-container'>
      {spots.map((spot) => {
                  console.log('avgRating', spot.avgRating)
        const avgRating = spot.avgRating !== undefined && spot.avgRating !== null
          ? Number(spot.avgRating).toFixed(1)
          : 'New';

          return (
            <div className='spotCard'
              key={spot.id}
              onClick={() => handleSpotClick(spot.id)}
              >
              <div className='spot'>
                <div className='previewImg'>
                  <img className='spot-img' src={spot.previewImage || null} alt={`${spot.name}`}
                    onError={(e) => {
                    e.target.src = placeholderImg;
                }}/>
                </div>
                <div className='spot-container'>
                  <p className='spot-name'>{spot.name}</p>
                  <p className='location'>
                    {`${spot.city}, ${spot.state}`}<span className='stars'>★{avgRating || 'New'}</span>
                  </p>
                  <p className='price'>
                    <span className='spot-price'>${spot.price}</span> night
                  </p>
                </div>
                <span className='tooltip'>{spot.name}</span>
              </div>
            </div>
          );
      })}
    </div>
  );

}

export default Spots;
