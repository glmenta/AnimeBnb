import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createSpotFxn } from '../../../store/spots'
import { useHistory } from 'react-router-dom'
//import * as StoreSpots from '../../../store/spots';

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
  const [previewImage, setPreviewImage] = useState("")
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [image2, setImage2] = useState("")
  const [image3, setImage3] = useState("")
  const [image4, setImage4] = useState("")
  const [image5, setImage5] = useState("")
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const [errors, setErrors] = useState([])


  const handleSubmit = async (e) => {
    e.preventDefault()

    //const parsedPrice = parseFloat(price)

    const newSpotForm = {
      country,
      address,
      city,
      state,
      description,
      name,
     // price: parsedPrice,
      lat,
      lng,
      price,
      previewImage,
      image2,
      image3,
      image4,
      image5,
    };

    console.log('this is new spot', newSpotForm);
    let newSpot;
    await dispatch(createSpotFxn(newSpotForm)).then((spot) => {
      newSpot = spot
      return history.push(`/spots/${spot.id}`)
    })


    if (newSpot) {
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
    }
  }


  return (
    <div className='create-new-spot-container'>
      <div className ='create-new-spot-contents'>
      <div className='create-new-spot-header'>
        <h1 className='create-new-spot-h1'>Create a new Spot</h1>
        <h3 className='create-new-spot-h3'>Where's your place located?</h3>
        <p className='create-new-spot-p'>Guests will only get your exact address once they booked a
          reservation.
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
            {/* {hasSubmitted && errors.country.length > 0 && errors.country.map((error, idx) => (
              <ul key={idx} className='create-new-spot-error-ul'>
                <li className='create-new-spot-error-li'>* {error}</li>
              </ul>
            ))} */}

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

          {/* {hasSubmitted && errors.address.length > 0 && errors.address.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}


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

          {/* {hasSubmitted && errors.city.length > 0 && errors.city.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}

          <label className='create-new-spot-label'>
            State
            <input
              type="text"
              onChange={(e) => setState(e.target.value)}
              value={state}

              placeholder='State'
              className='create-new-spot-input'
            />
          </label>

          {/* {hasSubmitted && errors.state.length > 0 && errors.state.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}

          <label className='create-new-spot-label'>
            Latitude
            <input
              type="text"
              onChange={(e) => setLat(e.target.value)}
              value={lat}

              placeholder='Lat'
              className='create-new-spot-input'
            />
          </label>

          <label className='create-new-spot-label'>
            Longitude
            <input
              type="text"
              onChange={(e) => setLng(e.target.value)}
              value={lng}

              placeholder='Lng'
              className='create-new-spot-input'
            />
          </label>

          <div className='line'></div>


          <label className='create-new-spot-label'>
            Description
            <textarea
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}

              placeholder='Tell us something about your spot...'
              className='create-new-spot-input'
              rows="10"
              cols="50"
            />
          </label>
{/*
          {hasSubmitted && errors.description.length > 0 && errors.description.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}


          <div className='line'></div>


          <label className='create-new-spot-label'>
            Create a Title for your Spot
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}

              placeholder='Name your Spot'
              className='create-new-spot-input'
            />
          </label>

          {/* {hasSubmitted && errors.name.length > 0 && errors.name.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}



          <label className='create-new-spot-label'>
            Set a price for your Spot
            <input
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              value={price}

              placeholder='Price per night (USD)'
              className='create-new-spot-input'
            />
          </label>

          {/* {hasSubmitted && errors.price.length > 0 && errors.price.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}


          <div className='line'></div>


          <p>Add Images</p>

          <label className='create-new-spot-label'>
            <input
              type="text"
              placeholder='Preview Image URL'
              className='create-new-spot-input'
              onChange={(e) => setPreviewImage(e.target.value)}
              value={previewImage}
            />

          </label>
{/*
          {hasSubmitted && errors.previewImage.length > 0 && errors.previewImage.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}

          <label className='create-new-spot-label'>
            <input
              type="text"
              placeholder='Image URL'
              className='create-new-spot-input'
              onChange={(e) => setImage2(e.target.value)}
              value={image2}
            />
          </label>
{/*
          {hasSubmitted && errors.image2.length > 0 && errors.image2.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}

          <label className='create-new-spot-label'>
            <input
              type="text"
              placeholder='Image URL'
              className='create-new-spot-input'
              onChange={(e) => setImage3(e.target.value)}
              value={image3}
            />
          </label>
{/*
          {hasSubmitted && errors.image3.length > 0 && errors.image3.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}

          <label className='create-new-spot-label'>
            <input
              type="text"
              placeholder='Image URL'
              className='create-new-spot-input'
              onChange={(e) => setImage4(e.target.value)}
              value={image4}
            />
          </label>
{/*
          {hasSubmitted && errors.image4.length > 0 && errors.image4.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}

          <label className='create-new-spot-label'>

            <input
              type="text"
              placeholder='Image URL'
              className='create-new-spot-input'
              onChange={(e) => setImage5(e.target.value)}
              value={image5}
            />
          </label>

          {/* {hasSubmitted && errors.image5.length > 0 && errors.image5.map((error, idx) => (
            <ul key={idx} className='create-new-spot-error-ul'>
              <li className='create-new-spot-error-li'>* {error}</li>
            </ul>
          ))} */}

          <div className='line'></div>
          <button disabled={Object.values(errors).flat().length > 0}>Create Spot</button>
        </form>
      </div>
      </div>
    </div >
  )
}

export default CreateNewSpot
