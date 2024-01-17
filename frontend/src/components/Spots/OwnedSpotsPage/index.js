import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { getSpotsFxn, deleteSpotFxn } from '../../../store/spots';
import './OwnedSpots.css';
import DeleteSpotModal from '../UpdateSpotsPage/DeleteSpotModal';

function OwnedSpotsPage() {

const history = useHistory();
const dispatch = useDispatch();
const user = useSelector(state => state.session.user);
const unfilteredSpots = useSelector((state) => Object.values(state.spot.spots));
const ownedSpots = unfilteredSpots.filter(spot => spot.ownerId === user.id)
const [deleteSpotModal, setDeleteSpotModal] = useState(false)
const [spotToDelete, setSpotToDelete] = useState('')

useEffect(() => {
    dispatch(getSpotsFxn())
},[dispatch])

//handle click functions
const closeDeleteSpotModal = () => {
    setDeleteSpotModal(false)
}

const handleDelete = (id) => {
    setSpotToDelete(id)
    setDeleteSpotModal(true)
}
const handleModalDelete = () => {
    dispatch(deleteSpotFxn(spotToDelete))
    setDeleteSpotModal(false)
    dispatch(getSpotsFxn())
}

const handleSpotClick = (spotId) => {
    history.push(`/spots/${spotId}`);
};

return (
    <div className ='manage-spots-container'>

        <div className= 'manage-spots-header'>
            <h1 className='manage-spots-title'>Manage Your Spots</h1>
        {/* { !ownedSpots.length && ( */}
            <div className='new-spot-link'>
            <Link to={`/spots/new`}className='new-spot-button'>Create a New Spot</Link>
            </div>
            {/* )} */}
        </div>
        {deleteSpotModal && (
            <DeleteSpotModal
            isOpen={deleteSpotModal}
            onClose={closeDeleteSpotModal}
            onDelete={handleModalDelete}
            />
        )}
        <div className='owned-spots-list'>
        {ownedSpots.map(spot => {
        const avgRating = spot.avgRating !== undefined && spot.avgRating !== null
        ? Number(spot.avgRating).toFixed(1)
        : 'New';
        return (
        <div className='manage-spots-list' key={spot.id} >
            <div className='owned-spot'>
                <div className='preview-img' onClick={() => handleSpotClick(spot.id)}>
                <img className='owned-spot-img' src={spot.previewImage || null} alt={`${spot.name}`}/>
                </div>
                <div className='owned-spot-info'>
                    <div className='owned-spot-info-location-reviews'>
                        <p className='owned-spot-location'>
                            {`${spot.city}, ${spot.state}`}
                        </p>
                        <p className='owned-spot-reviews'>
                            <span className='stars'>★{ avgRating || 'New' }</span>
                        </p>
                    </div>
                    <div className='owned-spot-price'>
                        <span className='spot-price'>${spot.price}</span> night
                    </div>
                </div>
                <div className='owned-spot-buttons'>
                    <div className ='update-button'>
                    <Link to={`/spots/${spot.id}/edit`} className='update-link'>
                                Update
                    </Link>
                    </div>
                    <div className='delete-button-modal'>
                        <button className='delete-button'
                            onClick={() => handleDelete(spot.id)}>
                            Delete
                        </button>

                    </div>
            </div>
            </div>
        </div>
        )
        })}
        </div>
    </div>
    )
}

export default OwnedSpotsPage;
