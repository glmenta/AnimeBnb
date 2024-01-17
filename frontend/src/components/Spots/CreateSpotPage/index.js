import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createSpotFxn } from '../../../store/spots'
import { useHistory } from 'react-router-dom'
//import "./CreateNewSpot.css"
import './updatedCreate.css';
function CreateNewSpot() {

  const dispatch = useDispatch();
  const history = useHistory();

  const [country, setCountry] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [description, setDescription] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [previewImage, setPreviewImage] = useState("")
  const [image2, setImage2] = useState("")
  const [image3, setImage3] = useState("")
  const [image4, setImage4] = useState("")
  const [image5, setImage5] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [errors, setErrors] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const imgErrors = {}
    const validateImage = async (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    };

    const newSpot = {
      country,
      address,
      city,
      state,
      description,
      name,
      lat,
      lng,
      price,
      previewImage,
      image2,
      image3,
      image4,
      image5,
    };

    const images = [previewImage, image2, image3, image4, image5];

    const newSpotImgs = images.map((img, index) => ({
      url: img,
      preview: index === 0,
    }));

    let createdSpot;

    try {
      if (!previewImage) {
        imgErrors.previewImage = 'Preview Image is required'
      } else if (!/\.(png|jpe?g)$/i.test(previewImage)) {
        imgErrors.previewImage = 'Preview Image must end in .png, .jpg or .jpeg'
      }

      await validateImage();

      await dispatch(createSpotFxn(newSpot, newSpotImgs)).then((spot) => {
        createdSpot = spot
        setCountry("")
        setAddress("")
        setCity("")
        setState("")
        setDescription("")
        setName("")
        setPrice("")
        setPreviewImage("")
        setImage2("")
        setImage3("")
        setImage4("")
        setImage5("")
        setHasSubmitted(true)
        setErrors([])
        history.push(`/spots/${spot.id}`)
      })} catch (res) {
          const data = await res.json();
          const imgErrors = {};

          if (!/\.(png|jpe?g)$/i.test(image2)) {
            imgErrors.imageUrl = 'Image URL must end in .png, .jpg or .jpeg'
          }
          if (data && data.errors) {
            const combinedErrors = {...data.errors, ...imgErrors}
            setErrors(combinedErrors)
          }
      }
    }

  return (
    <div className='create-new-spot-container'>
      <div className ='create-new-spot-contents'>

        <div className='create-new-spot-header'>
          <h1 className='create-new-spot-h1'>Create a new Spot</h1>
          <h3 className='create-new-spot-h3'>Where's your place located?</h3>
          <p className='create-new-spot-p'>
            Guests will only get your exact address once they booked a reservation.
          </p>
        </div>

      <div className='create-form-container'>

        <form onSubmit={handleSubmit} className='create-spot-form' >

          <label className='create-new-spot-label'>
            Country
            <p className='error'>{errors.country}</p>
            <input
              type="text"
              onChange={(e) => setCountry(e.target.value)}
              value={country}
              placeholder='Country'
              className='create-new-spot-input'
            />
          </label>

          <label className='create-new-spot-label'>
            Street Address
            <p className='error'>{errors.address}</p>
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
            <p className='error'>{errors.city}</p>
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
            <p className='error'>{errors.state}</p>
            <input
              type="text"
              onChange={(e) => setState(e.target.value)}
              value={state}

              placeholder='STATE'
              className='create-new-spot-input'
            />
          </label>
            <div className='lat-lng-div'>
          <label className='create-new-spot-label'>
            Latitude
            <p className='error'>{errors.lat}</p>
            <input
              type="text"
              onChange={(e) => setLat(e.target.value)}
              value={lat}
              placeholder='Latitude'
              className='create-new-spot-input'
              id='lat-input'
            />
            {/* <div className ='comma'>,</div> */}
          </label>
          <div className='lng-div'>
          <label className='create-new-spot-label'>
            Longitude
            <p className='error'>{errors.lng}</p>
            <input
              type="text"
              onChange={(e) => setLng(e.target.value)}
              value={lng}
              id='lng-input'
              placeholder='Longitude'
              className='create-new-spot-input'
            />
          </label>
          </div>
          </div>
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
          <p className='error'>{errors.description}</p>
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
          <p className='error'>{errors.name}</p>
          <label className='create-new-spot-label'>
            <h3>Set a base price for your spot</h3>
            <p>
            Competitive pricing can help your listing stand out and rank higher in search results.
            </p>
            <div className='price-div'>
            <p className='dollar-sign'>$</p>
            <input
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              placeholder='Price per night (USD)'
              className='create-new-spot-input'
              id='price-input'
            />
            </div>
          </label>
          <p className='error'>{errors.price}</p>
          <div className='line'></div>

          <label className='create-new-spot-label'>
          <h3>Liven up your spot with photos</h3>
          <p>
            Submit a link to at least one photo to publish your spot.
          <p className='error'>{errors.previewImage}</p>
          </p>
            <input
              type="text"
              placeholder='Preview Image URL'
              className='create-new-spot-input'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />
          </label>

          <p className='error'>{errors.imageUrl}</p>
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
          </label>

          <div className='line'></div>
          <div className='submit-div'>
          <button onClick={handleSubmit} className='create-submit-button' disabled={Object.values(errors).flat().length > 0}>Create Spot</button>
          </div>

        </form>
      </div>
      </div>
    </div >
  )
}

export default CreateNewSpot
