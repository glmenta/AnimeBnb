import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSpotsFxn } from '../../../store/spots';
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

  //redirects user to spot detail page
  const handleSpotClick = (spotId) => {
    history.push(`/spots/${spotId}`);
  };

  return spots && (
    <div className='spots-container'>
      {spots.map((spot) => {
        const avgRating = spot.avgRating !== undefined && spot.avgRating !== null
        ? Number(spot.avgRating).toFixed(1)
        : 'New';
        return (
            <div className = 'spotCard'>
            <div className='spot' key={spot.id} onClick={() => handleSpotClick(spot.id)}>
                <div className='previewImg'>
                <img className='spot-img' src={spot.previewImage || null} alt={`${spot.name}`} />
                </div>
                <div className='spot-container'>
                <p className='location'>
                    {`${spot.city}, ${spot.state}`}<span className='stars'>★{ avgRating || 'New' }</span>
                </p>
                <p className='spot-name tooltip' title={spot.name}>
                  {spot.name}
                  <span className='tooltip-text'>{spot.name}</span>
                </p>
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
