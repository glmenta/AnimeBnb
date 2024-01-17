import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getSpotDetailsFxn } from '../../../store/spots';
import { getReviewsFxn } from '../../../store/reviews';
import ReviewModal from '../../Reviews/ReviewModal';
import DeleteReviewModal from '../../Reviews/DeleteReviewModal';
import './updatedSpotDetail.css';

function SpotDetailPage () {
    const { spotId } = useParams();
    const spotDetail = useSelector(state => state.spot.spotDetails)
    const spotObj = useSelector(state => state.spot.spots)
    const user = useSelector(state => state.session.user);
    const dispatch = useDispatch();
    const history = useHistory();
    const [reviews, setReviews] = useState([])
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [deleteReviewModalOpen, setDeleteReviewModalOpen] = useState(false);
    const currSpot = (spotObj[spotId])
    // console.log('currSpot', currSpot);
    useEffect(() => {
        async function fetchData() {
            console.log('Fetching data...');
            await dispatch(getSpotDetailsFxn(spotId));
            const response = await dispatch(getReviewsFxn(spotId));
            const reviews = response.Reviews;
            console.log('Fetched data:', spotDetail, reviews);
            setReviews(reviews);
        }

        fetchData();
    }, [dispatch, spotId]);

    if(!spotDetail) {
        return <div>Loading...</div>
    }

    const openReviewModal = () => {
        setReviewModalOpen(true)
    }

    const closeReviewModal = () => {
        console.log('closing review modal')
        setReviewModalOpen(false)
        async function fetchReviews() {
            const response = await dispatch(getReviewsFxn(spotId));
            const reviews = response.Reviews;
            console.log('reviews', reviews)
            setReviews(reviews);
        }
        fetchReviews()
    }

    const openDeleteReviewModal = () => {
        setDeleteReviewModalOpen(true)
    }

    const closeDeleteReviewModal = () => {
        setDeleteReviewModalOpen(false);
        dispatch(getReviewsFxn(spotId))
            .then((response) => {
                const reviews = response.Reviews;
                setReviews(reviews);
            })
            .catch((error) => {
                console.error("Error fetching reviews:", error);
            });
    };


    //This is for the reserve button
    function handleClick () {
        alert('Feature Coming Soon')
    }

    //if there are reviews =>
    // const avgRating = reviews.length > 0
    // ? reviews.reduce((sum, review) => sum + review.stars, 0) / reviews.length
    // : 0;
    const sumOfStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const totalReviews = reviews.length;
    console.log('Sum of Stars:', sumOfStars);
    console.log('Total Reviews:', totalReviews);

    const avgRating = totalReviews > 0 ? sumOfStars / totalReviews : 0;
    console.log('Average Rating:', avgRating);

    console.log('reviews', reviews)
    console.log('numReviews:', reviews.length, spotDetail.numReviews);
    console.log('avgRating', avgRating)

    return spotDetail && (
        <div className = 'spot-detail-container'>
        <h1>{spotDetail.name}</h1>
        <h2>{spotDetail.city}, {spotDetail.state}, {spotDetail.country}</h2>
        <div className ='image-container'>
            <div className='images-box'>
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
                <div className='rating-container'>

                <div className='star-rating'>
                    ★{avgRating ? avgRating.toFixed(1) : 'New'}
                    {/* ★{typeof avgRating === 'number' ? avgRating.toFixed(1) : avgRating} */}
                </div>

                {reviews?.length > 0 && (
                    <div className='dot'><p>·</p></div>
                )}

            {reviews?.length > 0 && (
                <div className='reviews'>
                    <p>{reviews?.length} {reviews?.length === 1 ? 'Review' : 'Reviews'}</p>
                    {/* <p>{spotDetail?.numReviews} {spotDetail?.numReviews === 1 ? 'Review' : 'Review'}</p> */}
                </div>
                )}
                </div>
                </div>
                <button className='reserve-button' onClick={handleClick}>Reserve</button>
            </div>

            <div className='review-content'>
                <div className='review-content-top'>
                <div className='star-rating'>
                    ★{avgRating ? avgRating.toFixed(1) : 'New'}
                </div>

                {reviews?.length > 0 && (
                    <div className='dot'><p>·</p></div>
                )}

                {reviews?.length >= 1 && (
                <div className='num-reviews'>
                    <p>{reviews?.length} {reviews?.length === 1 ? 'Review' : 'Reviews'}</p>
                </div>
                )}
                </div>

                <div className='post-review-modal'>
                        {(user && (!reviews.find(review => review.userId === user?.id) && user?.id !== spotDetail?.ownerId)) && (
                        <button
                            className='post-review-button'
                            onClick={openReviewModal}>
                            Post your Review
                        </button>
                        )}
                        {reviewModalOpen && (
                            <ReviewModal
                            isOpen={reviewModalOpen}
                            onClose={closeReviewModal}
                            spotId={spotId}
                            />
                        )}

                </div>

            <div className='review-map'>
                {Array.isArray(reviews) && reviews?.length > 0 ? (
                reviews
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((review) => (
                    <div key={review.id}>
                        <p id='first-name'>{review.User.firstName}</p>
                        <p id='createdAt'>
                        {new Intl.DateTimeFormat('default', {
                            month: 'long',
                            year: 'numeric',
                        }).format(new Date(review.createdAt))}
                        </p>
                        <p id='review-description'>{review.review}</p>
                        <div className='delete-review-modal'>
                        {(((review.userId === user?.id && user?.id !== spotDetail?.ownerId))) && (
                            <button
                                className='post-review-button'
                                onClick={openDeleteReviewModal}>
                                Delete
                            </button>
                            )}

                            {(review.userId === user?.id && (
                                <DeleteReviewModal
                                isOpen={deleteReviewModalOpen}
                                onClose={closeDeleteReviewModal}
                                reviewId={review.id}
                                spotId={spotId}
                                />
                            ))}
                        </div>
                    </div>
                    ))
                ) : (
                    <div className='no-review-notice'>
                        {user && spotDetail?.numReviews < 1 && (
                        <p id='no-reviews'>Be the first to post a review!</p>
                        )}
                    </div>
                )}
                </div>

            </div>
        </div>
    </div>
    )

}

export default SpotDetailPage
