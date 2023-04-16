import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createSpotFxn } from '../../../store/spots'
import { useHistory } from 'react-router-dom'
import "./CreateNewSpot.css"

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

  const [errors, setErrors] = useState({})


  const validateFileExtension = (url) => {
    const allowedExtensions = ['.png', '.jpeg', '.jpg'];
    const fileExtension = url.slice(url.lastIndexOf('.'));

    return allowedExtensions.includes(fileExtension);
  };

  useEffect(() => {

    if (hasSubmitted) {
      const validationErrors = { country: [], address: [], city: [], state: [], description: [], name: [], price: [], previewImage: [], image2: [], image3: [], image4: [], image5: [] }
      if (!country.length) validationErrors.country.push("Country is required")
      if (!address.length) validationErrors.address.push("Address is required")
      if (!city.length) validationErrors.city.push("City is required")
      if (!state.length) validationErrors.state.push("State is required")
      if (description.length < 30) validationErrors.description.push("Description needs a minimum of 30 characters")
      if (!name.length) validationErrors.name.push("Name is required")
      if (!price.length) validationErrors.price.push("Price is required")
      if (!validateFileExtension(previewImage)) validationErrors.previewImage.push("Image URL must end in .png, .jpg, or .jpeg")
      if (!validateFileExtension(image2) && image2.length > 0) validationErrors.image2.push("Image URL must end in .png, .jpg, or .jpeg")
      if (!validateFileExtension(image3) && image3.length > 0) validationErrors.image3.push("Image URL must end in .png, .jpg, or .jpeg")
      if (!validateFileExtension(image4) && image4.length > 0) validationErrors.image4.push("Image URL must end in .png, .jpg, or .jpeg")
      if (!validateFileExtension(image5) && image5.length > 0) validationErrors.image5.push("Image URL must end in .png, .jpg, or .jpeg")
      setErrors(validationErrors)
    }

  }, [hasSubmitted, country, address, city, state, description, name, price, previewImage, image2, image3, image4, image5])

  const handleSubmit = async (e) => {
    e.preventDefault()

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
      return
    })
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

      <div className='form-container'>

        <form onSubmit={handleSubmit} className='create-spot-form' >

        {hasSubmitted && errors.country.length > 0 && errors.country.map((error, idx) => (
              <ul key={idx} className='create-new-spot-error-ul'>
                <li className='create-new-spot-error-li'>* {error}</li>
              </ul>
            ))}

          <label className='create-new-spot-label'>
            Country
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

          <label className='create-new-spot-label'>
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
          </label>

          <div className='line'></div>
          <button disabled={Object.values(errors).flat().length > 0}>Create Spot</button>
        </form>
      </div>
      </div>
    </div >
  )
}

export default CreateNewSpot

  // const errors = {};

    // if (!country) {
    //   errors.country = "Country is required.";
    // }

    // if (!address) {
    //   errors.address = "Street address is required.";
    // }

    // if (!city) {
    //   errors.city = "City is required.";
    // }

    // if (!state) {
    //   errors.state = "State is required.";
    // }

    // if (!lat) {
    //   errors.lat = "Latitude is required.";
    // }

    // if (!lng) {
    //   errors.lng = "Longitude is required.";
    // }

    // if (!description || description.length < 30) {
    //   errors.description = "Description must be at least 30 characters.";
    // }

    // if (!name) {
    //   errors.name = "Name is required.";
    // }

    // if (!price) {
    //   errors.price = "Price is required.";
    // }
