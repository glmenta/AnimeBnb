import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSpotDetailsFxn } from '../../../store/spots';
import './SpotDetails.css';

function SpotDetailPage () {
    const { spotId } = useParams();
    const spotDetail = useSelector(state => state.spot.spotDetails)
    //const reviewDetail = useSelector(state => state.review.currentReviews)

    const dispatch = useDispatch();

    const [review, setReview] = ('')
    const [stars, setStars] = useState(1)

    useEffect(() => {
        dispatch(getSpotDetailsFxn(spotId));
      }, [dispatch, spotId]);

    if(!spotDetail) {
        return <div>Loading...</div>
    }

    return spotDetail && (
        <div className = 'spot-detail-container'>
        <h1>{spotDetail.name}</h1>
        <h2>{spotDetail.city}, {spotDetail.state}, {spotDetail.country}</h2>
        <div className='image-grid'>
            {spotDetail?.SpotImages.map(image => <img src={spotDetail.previewImage} key={image} alt={spotDetail.name} />)}
        </div>
        <div className='spot-info'>
            <div className='host-text'>
                <h1>Hosted by {spotDetail.Owner.firstName} {spotDetail.Owner.lastName}</h1>
                <p>{spotDetail.description}</p>
            </div>
            <div className='review-box'>
                <div className='price-per-night'>
                    <h1>${spotDetail.price}night</h1>
                </div>
                <div classname='star-rating'>
                    ★{Number(spotDetail.avgRating) ? Number(spotDetail.avgRating).toFixed(1) : 'New'}
                </div>
                <div className='reviews'>
                    <p>{Number(spotDetail.numReviews)}Reviews</p>
                </div>
                <button className='reserve-button'>Reserve</button>
            </div>
        </div>
    </div>
    )
}

export default SpotDetailPage
