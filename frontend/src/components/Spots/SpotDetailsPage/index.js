import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSpotDetailsFxn } from '../../../store/spots';
import { getReviewsFxn } from '../../../store/reviews';
import './updatedSpotDetail.css';

function SpotDetailPage () {
    const { spotId } = useParams();
    const spotDetail = useSelector(state => state.spot.spotDetails)
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const [reviews, setReviews] = useState([])

    //this grabs our spot details in general
    useEffect(() => {
        dispatch(getSpotDetailsFxn(spotId));
      }, [dispatch, spotId]);

    //this allows us to grab our reviews for that spot
    useEffect(() => {
        dispatch(getReviewsFxn(spotId)).then(reviews => setReviews(reviews.Reviews))
    }, [spotId])

    if(!spotDetail) {
        return <div>Loading...</div>
    }

    //This is for the reserve button
    function handleClick () {
        alert('Feature Coming Soon')
    }

    return spotDetail && (
        <div className = 'spot-detail-container'>
        <h1>{spotDetail.name}</h1>
        <h2>{spotDetail.city}, {spotDetail.state}, {spotDetail.country}</h2>
        <div className ='image-container'>
                <div className='main-spot-img'>
                    {spotDetail?.SpotImages.find(image => image.preview === true) ?
                    <img src={spotDetail?.SpotImages.find(image => image.preview === true).url} alt={spotDetail?.name} /> :
                    <p>No image available</p>
                    }
                </div>

                <div className='spot-img-filter'>
                {spotDetail?.SpotImages.filter(image => image.preview !== true).map((image, index) => (
                    <img key={index} id={`spotImage${index + 1}`} src={image.url} alt={spotDetail?.name} />
                ))}
        </div>
        </div>
        <div className='spot-info'>
            <div className='host-text'>
                <h1 id = 'host-info'>Hosted by {spotDetail.Owner.firstName} {spotDetail.Owner.lastName}</h1>
                <p id='spot-description'>{spotDetail.description}</p>
            </div>
            <div className='review-box'>
                <div className='review-box-top'>
                <div className='price-per-night'>
                    <h1>${spotDetail.price}night</h1>
                </div>
                <div classname='star-rating'>
                    ★{Number(spotDetail.avgRating) ? Number(spotDetail.avgRating).toFixed(1) : 'New'}
                </div>
                <div className = 'dot'><p>·</p></div>
                <div className='reviews'>
                    <p>{Number(spotDetail.numReviews)}Reviews</p>
                </div>
                </div>
                <button className='reserve-button' onClick={handleClick}>Reserve</button>
            </div>
            { user && user.id !== spotDetail.ownerId ? (
            <div className='review-content'>
                <div className='review-content-top'>
                <div classname='star-rating'>
                    ★{Number(spotDetail.avgRating) ? Number(spotDetail.avgRating).toFixed(1) : 'New'}
                </div>
                <div className = 'dot'><p>·</p></div>
                { spotDetail.numReviews >= 1 && (
                    <div className='num-reviews'>
                        <p>{Number(spotDetail.numReviews)}Reviews</p>
                    </div>
                )}
                </div>
            <div className='review-map'>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(review => (
                  <div key={review.id}>
                    <p id='first-name'>{review.User.firstName}</p>
                    <p id='createdAt'>{new Intl.DateTimeFormat('default', { month: 'long', year: 'numeric' }).format(new Date(review.createdAt))}</p>
                    <p id='review-description'>{review.review}</p>
                  </div>
                ))
            ) : (
                <div>
                <button className='post-review-button'>Post your Review</button>
                <p id='no-reviews'>Be the first to post a review!</p>
              </div>
            )}
            </div>

            </div>
            ) : null}
        </div>
    </div>
    )

}

export default SpotDetailPage
