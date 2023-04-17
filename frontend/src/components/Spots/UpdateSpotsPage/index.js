import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateSpotFxn, getSpotsFxn, getSpotDetailsFxn} from '../../../store/spots'
import { useHistory, useParams } from 'react-router-dom'

function UpdateSpotPage() {

  const dispatch = useDispatch();
  const history = useHistory();

  const { spotId } = useParams();

  const spots = useSelector(state => Object.values(state.spot.spots))
  const currUser = useSelector(state => state.session.user)
  const userSpots = spots.filter((spot) => currUser.id === spot.ownerId)
  const selectSpot = userSpots.find((spot) => spot.id === parseInt(spotId))
  const spotImgDetails = useSelector(state => state.spot.spotDetails)

  const [country, setCountry] = useState(selectSpot?.country || '')
  const [address, setAddress] = useState(selectSpot?.address || '')
  const [city, setCity] = useState(selectSpot?.city || '')
  const [state, setState] = useState(selectSpot?.state || '')
  const [description, setDescription] = useState(selectSpot?.description || '')
  const [name, setName] = useState(selectSpot?.name || '')
  const [price, setPrice] = useState(selectSpot?.price || '')
  const [lat, setLat] = useState(selectSpot?.lat || '')
  const [lng, setLng] = useState(selectSpot?.lng || '')
  // const [previewImage, setPreviewImage] = useState(selectSpot?.previewImage || '')
  // const [image2, setImage2] = useState(spotImgDetails?.image2 || '')
  // const [image3, setImage3] = useState(spotImgDetails?.image3 || '')
  // const [image4, setImage4] = useState(spotImgDetails?.image4 || '')
  // const [image5, setImage5] = useState(spotImgDetails?.image5 || '')
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const [errors, setErrors] = useState({})

  useEffect(() => {
    dispatch(getSpotDetailsFxn(selectSpot.id))
  }, [dispatch, selectSpot.id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const updateSpot = {
      country,
      address,
      city,
      state,
      description,
      name,
      lat,
      lng,
      price,
      // previewImage,
      // image2,
      // image3,
      // image4,
      // image5,
    };

    // const images = [previewImage, image2, image3, image4, image5];

    // const updatedSpotImgs = images.map((img, index) => ({
    //   url: img,
    //   preview: index === 0,
    // }));

    console.log('this is updated spot', updateSpot);
    let updatedSpot;
    console.log('this is selectSpot.id', selectSpot.id)
    await dispatch(updateSpotFxn(updateSpot, selectSpot.id)).then((spot) => {
      updatedSpot = spot
      console.log('newly updated spot', spot)
      setCountry("")
      setAddress("")
      setCity("")
      setState("")
      setDescription("")
      setName("")
      setPrice("")
      // setPreviewImage("")
      // setImage2("")
      // setImage3("")
      // setImage4("")
      // setImage5("")
      setHasSubmitted(true)
      setErrors([])
      history.push(`/spots/${spot.id}`)
      return
    }).catch((err) => {
      console.log('Err updating spot', err)
    })
  }


  return (
    <div className='create-new-spot-container'>
      <div className ='create-new-spot-contents'>

        <div className='create-new-spot-header'>
          <h1 className='create-new-spot-h1'>Update your Spot</h1>
          <h3 className='create-new-spot-h3'>Where's your place located?</h3>
          <p className='create-new-spot-p'>
            Guests will only get your exact address once they booked a reservation.
          </p>
        </div>

      <div className='form-container'>

        <form onSubmit={handleSubmit} className='create-spot-form' >

          <label className='create-new-spot-label'>
            Country
            <input
              type="text"
              onChange={(e) => setCountry(e.target.value)}
              value={country}

              placeholder='Country'
              className='create-new-spot-input'
            />
{/*
            {hasSubmitted && country === '' && (
              <span className='span-error'>
                Country is Required
              </span>
            )} */}
          </label>

       {/* {hasSubmitted && errors.country.length > 0 && (
              <ul>
                {Object.values(errors.country).map((error, index) => (
                <li key={index}>{error}</li>
                ))}
              </ul>
            )} */}

          <label className='create-new-spot-label'>
            Street Address
            <input
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              value={address}

              placeholder='Street Address'
              className='create-new-spot-input'
            />
          </label>

          <label className='create-new-spot-label'>
            City
            <input
              type="text"
              onChange={(e) => setCity(e.target.value)}
              value={city}

              placeholder='City'
              className='create-new-spot-input'
            />
          </label>

          <label className='create-new-spot-label'>
            State
            <input
              type="text"
              onChange={(e) => setState(e.target.value)}
              value={state}

              placeholder='STATE'
              className='create-new-spot-input'
            />
          </label>

          <label className='create-new-spot-label'>
            Latitude
            <input
              type="text"
              onChange={(e) => setLat(e.target.value)}
              value={lat}
              placeholder='Latitude'
              className='create-new-spot-input'
            />
          </label>

          <div className ='comma'>,</div>
          <label className='create-new-spot-label'>
            Longitude
            <input
              type="text"
              onChange={(e) => setLng(e.target.value)}
              value={lng}

              placeholder='Longitude'
              className='create-new-spot-input'
            />
          </label>

          <div className='line'></div>

          <label className='create-new-spot-label'>
            <h3>Describe your place to guests</h3>
            <p>
              Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.
              </p>
            <textarea
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}

              placeholder='Please write at least 30 characters'
              className='create-new-spot-input'
              rows="10"
              cols="50"
            />
          </label>

          <div className='line'></div>


          <label className='create-new-spot-label'>
            <h3>Create a Title for your Spot</h3>
            <p>
              Catch guests' attention with a spot title that highlights what makes your place special.
              </p>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}

              placeholder='Name of your spot'
              className='create-new-spot-input'
            />
          </label>

          <label className='create-new-spot-label'>
            <h3>Set a base price for your spot</h3>
            <p>
            Competitive pricing can help your listing stand out and rank higher in search results.
            </p>
            <input
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              value={price}

              placeholder='Price per night (USD)'
              className='create-new-spot-input'
            />
          </label>

          <div className='line'></div>

          {/* <label className='create-new-spot-label'>
          <h3>Liven up your spot with photos</h3>
          <p>
            Submit a link to at least one photo to publish your spot.
          </p>
            <input
              type="text"
              placeholder='Preview Image URL'
              className='create-new-spot-input'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />
          </label>

          <label className='create-new-spot-label'>
            <input
              type="text"
              placeholder='Image URL'
              className='create-new-spot-input'
              onChange={(e) => setImage2(e.target.value)}
              value={image2}
            />
          </label>


          <label className='create-new-spot-label'>
            <input
              type="text"
              placeholder='Image URL'
              className='create-new-spot-input'
              onChange={(e) => setImage3(e.target.value)}
              value={image3}
            />

          </label>


          <label className='create-new-spot-label'>
            <input
              type="text"
              placeholder='Image URL'
              className='create-new-spot-input'
              onChange={(e) => setImage4(e.target.value)}
              value={image4}
            />
          </label>


          <label className='create-new-spot-label'>

            <input
              type="text"
              placeholder='Image URL'
              className='create-new-spot-input'
              onChange={(e) => setImage5(e.target.value)}
              value={image5}
            />
          </label> */}

          <div className='line'></div>
          <button disabled={Object.values(errors).flat().length > 0}>Create Spot</button>
        </form>
      </div>
      </div>
    </div >
  )
}

export default UpdateSpotPage;
