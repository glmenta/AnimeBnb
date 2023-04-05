import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getSpotDetailsFxn } from '../../store/spots';

function SpotDetailPage () {
    const { spotId } = useParams();
    // const spotDetail = useSelector(state => state.spots && state.spots.find(spot => spot.id === +spotId))
    // const spotDetail = useSelector(state => state.spots && state.spots[spotId])
    const spotDetail = useSelector((state) => (
        state.session.spots.find((spot) => spot.id === +spotId)
      ))
    const dispatch = useDispatch();
    // const history = useHistory();

    useEffect(() => {
        dispatch(getSpotDetailsFxn(spotId));
      }, [dispatch, spotId]);

    if(!spotDetail) {
        return <div>Loading...</div>
    }

    return (
        <div>
        <h1>{spotDetail.name}</h1>
        <h2>{spotDetail.city}, {spotDetail.state}, {spotDetail.country}</h2>
        <div className='image-grid'>
            {spotDetail.images.map(image => <img src={spotDetail.previewImage} key={image} alt={spotDetail.name} />)}
        </div>
        <div className='spot-info'>
            <div className='host-text'>
                <h1>Hosted by {spotDetail.owner.firstName} {spotDetail.owner.lastName}</h1>
                <p>{spotDetail.description}</p>
            </div>
            <div className='review-box'>
                {/* Implement review component here */}
            </div>
        </div>
        {/* <button onClick={handleBooking}>Book this spot</button> */}
    </div>
    )
}

export default SpotDetailPage
