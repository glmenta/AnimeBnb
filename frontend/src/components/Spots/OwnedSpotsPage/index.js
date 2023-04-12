import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
//import { deleteSpot } from './api'; //I need a similar import from my spots store
import { getSpotsFxn } from '../../../store/spots';
//import './OwnedSpots.css';

function OwnedSpotsPage() {

const history = useHistory();
const dispatch = useDispatch();
const user = useSelector(state => state.session.user);
console.log(user)
//this useSelector filters ownedSpots but has
//const ownedSpots = useSelector(state => state.spots.filter(spot => spot.ownerId === user.id))
const unfilteredSpots = useSelector((state) => Object.values(state.spot.spots));
console.log('this is unfiltered spots from ownedSpotsPage', unfilteredSpots)
const ownedSpots = unfilteredSpots.filter(spot => spot.ownerId === user.id)
console.log('this is filtered or owned spots', ownedSpots)

useEffect(() => {
    dispatch(getSpotsFxn())
},[dispatch])

//handle click functions
//history.push(`/spots/${spotId}/edit`)
// const  updateClick = (spotId, e) => {
//     e.preventDefault();
//     return <Link to={`/spots/${spotId}/edit`}>Update</Link>
// }

const deleteClick = () => {

}

const handleSpotClick = (spotId) => {
    history.push(`/spots/${spotId}`);
};

return (
   <div className ='manage-spots-container'>

        <div className= 'manage-spots-header'>
            <h1>Manage Your Spots</h1>
            <button className='create-spot-button'>Create a New Spot</button>
        </div>

        {/* this should be similar to spot list */}
        {ownedSpots.map(spot => {
         const avgRating = spot.avgRating !== undefined && spot.avgRating !== null
         ? Number(spot.avgRating).toFixed(1)
         : 'New';
         return (
        <div className='manage-spots-list' key={spot.id} onClick={() => handleSpotClick(spot.id)}>
            <div className='owned-spot'>
                <div className='preview-img'>
                <img className='owned-spot-img' src={spot.previewImage || null} alt={`${spot.name}`}/>
                </div>
                <div className='owned-spot-info'>
                    <div className='owned-spot-info-location-reviews'>
                        <p className='owned-spot-location'>
                            {/* spot.city and spot.state here */}
                            {`${spot.city}, ${spot.state}`}
                        </p>
                        <p className='owned-spot-reviews'>
                        {/* star and spot.numReviews */}
                            <span className='stars'>★{ avgRating || 'New' }</span>
                        </p>
                    </div>
                    <div className='owned-spot-price'>
                        {/* spot.price per night */}
                        <span className='spot-price'>${spot.price}</span> night
                    </div>
                </div>
                <div className='owned-spot-buttons'>
                    <Link to={`/spots/${spot.id}/edit`}>
                        {/* <button className='update-button'> */}
                                Update
                        {/* </button> */}
                    </Link>
                    <button className='delete-button'>
                        {/* delete button */}
                        Delete
                    </button>
                </div>
            </div>
        </div>
         )
         })}
    </div>
    )
}

export default OwnedSpotsPage;
