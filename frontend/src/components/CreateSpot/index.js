import React, { useState } from "react";
import { /* useDispatch ,*/ useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import { createSpot } from "../../store/spot";
import './CreateSpot.css';


function CreateSpotForm() {
    // const dispatch = useDispatch();
    const history = useHistory();
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const [image2Url, setImage2Url] = useState("");
    const [image3Url, setImage3Url] = useState("");
    const [image4Url, setImage4Url] = useState("");
    const [image5Url, setImage5Url] = useState("");
    // const [errors, setErrors] = useState([]);

    const sessionUser = useSelector(state => state.session.user);

    // redirect to / if no user logged in
    if (sessionUser === null) history.push(`/`);

    const handleSubmit = (e) => {
      e.preventDefault();

      // spotImages will always have previewUrl, conditionals for other images
      let spotImages = [{url: previewUrl, preview: true}];
      if (image2Url) spotImages.push({url: image2Url, preview: false});
      if (image3Url) spotImages.push({url: image2Url, preview: false});
      if (image4Url) spotImages.push({url: image2Url, preview: false});
      if (image5Url) spotImages.push({url: image2Url, preview: false});

      const newSpot = {
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
        SpotImages: spotImages,
        Owner: {
            id: sessionUser.id,
            firstName: sessionUser.firstName,
            lastName: sessionUser.lastName
        }
      }

      console.log("newSpot: ", newSpot);

    //   if (newSpot) {
    //     dispatch(createSpot(newSpot));
    //     // should also dispatch newSpotImages as well to populate that table in the db

    //     history.push(`/spots/${newSpot.id}`);
    //   }

      setCountry("");
      setAddress("");
      setCity("");
      setState("");
      setLat("");
      setLng("");
      setDescription("");
      setName("");
      setPrice("");
      setPreviewUrl("");
      setImage2Url("");
      setImage3Url("");
      setImage4Url("");
      setImage5Url("");

    };

    return (
      <div className="create-spot-container">
        <form className="create-spot-form" onSubmit={handleSubmit}>
          <h1 className="form-text form-header">Create a Spot</h1>
          <div className="first-section">
            <h2 className="section-header"> Where's your place  located?</h2>
            <p className="section-description"> Guests will only get your exact address once they booked a reservation. </p>
            {/* <ul>
                {errors.map((error, idx) => <li key={idx} className="errors">{error}</li>)}
            </ul> */}
            <label className="form-text">
                Country
                <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                />
            </label>
            <label className="form-text">
                Street Address
                <input
                type="text"
                placeholder="State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                />
            </label>
            <div className="city-state">
                <label className="form-text city">
                    City
                    <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    />
                </label>
                <p className="comma">,</p>
                <label className="form-text state">
                    State
                    <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    />
                </label>
            </div>
            <div className="lat-long">
                <label className="form-text lat">
                    Latitude
                    <input
                    type="text"
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    required
                    />
                </label>
                <p className="comma">,</p>
                <label className="form-text lng">
                    Longitude
                    <input
                    type="text"
                    placeholder="Longitude"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    required
                    />
                </label>
            </div>
          </div>
          <div className="second-section">
            <h2 className="section-header"> Describe your place to guests </h2>
            <p className="section-description"> Mention the best features your space, any special amentities like fast wifi or parking, and what you love about the neighborhood. </p>
            <textarea
                className="description"
                placeholder="Please write at least 30 characters"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="third-section">
            <h2 className="section-header"> Create a name for your spot </h2>
            <p className="section-description"> Catch guests' attention with a spot name that highlights what makes your place special. </p>
            <input
                type="text"
                placeholder="Name of your spot"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
          </div>
          <div className="fourth-section">
            <h2 className="section-header"> Set a base price for your spot </h2>
            <p className="section-description"> Competitive pricing can help your listing stand out and rank higher in search results. </p>
            <div className="pricing-input">
                <p className="dollar-sign">$</p>
                <input
                    type="text"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
          </div>
          <div className="fifth-section">
            <h2 className="section-header"> Liven up your spot with photos </h2>
            <p className="section-description"> Submit a link to at least one photo to publish your spot. </p>
            <input
                type="text"
                placeholder="Preview Image URL"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Image URL"
                value={image2Url}
                onChange={(e) => setImage2Url(e.target.value)}
            />
            <input
                type="text"
                placeholder="Image URL"
                value={image3Url}
                onChange={(e) => setImage3Url(e.target.value)}
            />
            <input
                type="text"
                placeholder="Image URL"
                value={image4Url}
                onChange={(e) => setImage4Url(e.target.value)}
            />
            <input
                type="text"
                placeholder="Image URL"
                value={image5Url}
                onChange={(e) => setImage5Url(e.target.value)}
            />
          </div>
          <div className="create-spot-button-container">
            {/* disabled based on validations? */}
          <button className="create-spot-button form-text" type="submit">Create Spot</button>
          </div>
        </form>
      </div>
    );
  }

  export default CreateSpotForm;
