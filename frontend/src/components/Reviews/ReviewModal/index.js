import React, { useReducer, useState } from 'react';
import { addReviewFxn } from '../../../store/reviews';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../../context/Modal';
import { useHistory } from 'react-router-dom';
import './Review.css';

function ReviewModal({isOpen, onClose, spotId}) {
    const dispatch = useDispatch();
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState([])
    const { closeModal } = useModal();
    const history = useHistory();

    //validations
    const MIN_REVIEW_LENGTH = 10;

    const validReview = review.length >= MIN_REVIEW_LENGTH;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([])

        const reviewData = {
            review,
            stars
        }

        console.log('this is review data from review modal', reviewData)

        return dispatch(addReviewFxn(spotId, reviewData))
            .then(history.push(`/spots/${spotId}`))
            .catch(
                async(res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    } else {
                        setErrors(['Please provide a review'])
                    }
                }
            )
    }

    if (!isOpen) {
        return null
    }

    const handleStarClick = (i) => {
        setStars(i)
    }

    const reviewStars = () => {
        const starArr = [];

        for (let i = 1; i <= 5; i++) {
            starArr.push(<i key={i} className={`fa${stars >= i ? 's' : 'r'} fa-star`} onClick={() => handleStarClick(i)} />)
    }
        return starArr;
    }

    return (
        <div className='review-modal-container' onClick={onClose}>
            <div className='review-modal' onClick={(e) => e.stopPropagation()}>
                <form className='post-review-form' onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                    <h2 className='review-modal-title'>How was your stay?</h2>
                    <label className='post-review-label'>
                        <textarea
                        type="text"
                        placeholder='Leave your review here...'
                        className='post-review-form-textarea'
                        rows="10"
                        cols="50"
                        onChange={(e) => setReview(e.target.value)}
                        value={review}
                        />
                    </label>
                    <div className='review-modal-star'>{reviewStars()} Stars</div>
                    <button className='review-modal-button'
                        disabled={stars < 1 || review.length < 10}>
                        Submit your Review
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ReviewModal
