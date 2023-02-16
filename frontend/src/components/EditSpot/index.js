import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateSpot } from "../../store/spot";
import './EditSpot.css';


function EditSpotForm({editSpot}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const { spotId } = useParams();

    const [country, setCountry] = useState(editSpot.country);
    const [address, setAddress] = useState(editSpot.address);
    const [city, setCity] = useState(editSpot.city);
    const [state, setState] = useState(editSpot.state);
    const [lat, setLat] = useState(editSpot.lat);
    const [lng, setLng] = useState(editSpot.lng);
    const [description, setDescription] = useState(editSpot.description);
    const [name, setName] = useState(editSpot.name);
    const [price, setPrice] = useState(parseFloat(editSpot.price).toFixed(2).toString());
    const [previewUrl, setPreviewUrl] = useState(editSpot.SpotImages[0].url);
    const [image2Url, setImage2Url] = useState(editSpot.SpotImages[1] ? editSpot.SpotImages[1].url : "");
    const [image3Url, setImage3Url] = useState(editSpot.SpotImages[2] ? editSpot.SpotImages[2].url : "");
    const [image4Url, setImage4Url] = useState(editSpot.SpotImages[3] ? editSpot.SpotImages[3].url : "");
    const [image5Url, setImage5Url] = useState(editSpot.SpotImages[4] ? editSpot.SpotImages[4].url : "");
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const sessionUser = useSelector(state => state.session.user);

    // should be done using .catch on the dispatch, need to rework backend error handling
    useEffect(() => {
        const errors = {};

        if (country.length < 3 || country.length > 56) {
        errors.country = "Country must be between 3 and 56 characters";
        }
        if (country === "") {
        errors.country = "Country is required";
        }
        let countryNum = country.match(/\d+/g);
        if (countryNum != null) {
        errors.country = "Country cannot have a number in it";
        }
        let addressArr = address.split(" ");
        let addressNum = parseInt(addressArr[0]);
        if (Number.isNaN(addressNum)) {
        errors.address = "Address must start with a number";
        }
        if (address === "") {
        errors.address = "Address is required";
        }
        if (city === "") {
        errors.city = "City is required";
        }
        let cityNum = city.match(/\d+/g);
        if (cityNum != null) {
        errors.city = "City cannot have a number in it";
        }
        if (city.length > 105) {
        errors.city = "City cannot exceed 105 characters";
        }
        if (state === "") {
        errors.state = "State is required";
        }
        let stateNum = state.match(/\d+/g);
        if (stateNum != null) {
        errors.state = "State cannot have a number in it";
        }
        if (state.length > 105) {
        errors.state = "State cannot exceed 105 characters";
        }
        if (description.length < 30) {
        errors.description = "Description needs a minimum of 30 characters";
        }
        if (description.length > 500) {
        errors.description = "Description cannot exceed 500 characters";
        }
        if (name === "") {
        errors.name = "Name is required";
        }
        if (name.length > 32) {
        errors.name = "Name cannot exceed 32 characters";
        }
        if (isNaN(Number.parseFloat(price))) {
        errors.price = "Price needs to be in USD format";
        }
        if (Number.parseFloat(price).toFixed(2).toString() !== price) {
        errors.price = "Price needs to be in USD format";
        }
        if (price === "") {
        errors.price = "Price is required";
        }

        setErrors(errors);
    }, [country, address, city, state, lat, lng, description, name, price]);

    if (editSpot === null) return null;

    // redirect to / if no user logged in (CAUSES REDIRECT ON FIRST ATTEMPT AT EDITING AN OWNED SPOT AFTER BEING REDIRECTED FROM EDITING AN UNOWNED SPOT)
    if (sessionUser === null) history.push(`/`);

    // redirect to / if sessionUser isn't spot owner:
    console.log("sessionUser.id: ", sessionUser.id);
    console.log("editSpot.Owner.id: ", editSpot.Owner.id);
    if (sessionUser.id !== editSpot.Owner.id) history.push(`/`);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // track if submit has been pressed for error showing
        setHasSubmitted(true);

        //hard code lat/lng for now, eventaully can have a geo spot API to get lat/lng based on input address
        setLat(12.3456789);
        setLng(12.3456789);

        const spotImages = [{url: previewUrl, preview: true}];
        if (image2Url) spotImages.push({url: image2Url, preview: false});
        if (image3Url) spotImages.push({url: image3Url, preview: false});
        if (image4Url) spotImages.push({url: image4Url, preview: false});
        if (image5Url) spotImages.push({url: image5Url, preview: false});

        const editSpot = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price,
            Owner: {
                id: sessionUser.id,
                firstName: sessionUser.firstName,
                lastName: sessionUser.lastName
            },
            SpotImages: spotImages
        }

        // do not dispatch anything if there are errors
        if (Object.keys(errors).length > 0) {
        window.alert("Fix errors before creating spot!");
        return
        };

        if (editSpot) {
        // use same .catch format from login/signup modals to directly grab errors from backend if time (backend needs rework to make errors and object and not setting one error at a time if doing this)
        await dispatch(updateSpot(editSpot, spotId));

        setHasSubmitted(false);

        // or redirect to /spots/current?
        history.push(`/spots/${spotId}`);
        }

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
        <div className="edit-spot-container">
        <form className="edit-spot-form" onSubmit={handleSubmit}>
            <h1 className="form-text form-header">Update your Spot</h1>
            <div className="first-section">
            <h2 className="section-header"> Where's your place  located?</h2>
            <p className="section-description"> Guests will only get your exact address once they booked a reservation. </p>
            {/* <ul>
                {errors.map((error, idx) => <li key={idx} className="errors">{error}</li>)}
            </ul> */}
            <label className="form-text" htmlFor='country'>
            Country {<span className={hasSubmitted ? "error" : "hidden"}>{errors.country}</span>}
            </label>
                <input
                type="text"
                id="country"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                />
            <label className="form-text">
                Street Address {<span className={hasSubmitted ? "error" : "hidden"}>{errors.address}</span>}
            </label>
                <input
                type="text"
                placeholder="State"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />

            <div className="city-state">
                <div className="city">
                    <label className="form-text">
                        City {<span className={hasSubmitted ? "error" : "hidden"}>{errors.city}</span>}
                    </label>
                        <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        />
                </div>
                <p className="comma">,</p>
                <div className="state">
                    <label className="form-text">
                        State {<span className={hasSubmitted ? "error" : "hidden"}>{errors.state}</span>}
                    </label>
                        <input
                        type="text"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        />
                </div>
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
                {<span className={hasSubmitted ? "error" : "hidden"}>{errors.description}</span>}
            </div>
            <div className="third-section">
                <h2 className="section-header"> Update the name for your spot </h2>
                <p className="section-description"> Catch guests' attention with a spot name that highlights what makes your place special. </p>
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {<span className={hasSubmitted ? "error" : "hidden"}>{errors.name}</span>}
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
                    />
                </div>
                {<span className={hasSubmitted ? "error" : "hidden"}>{errors.price}</span>}
            </div>
            <div className="edit-spot-button-container">
            <button className="edit-spot-button form-text" type="submit">Update Spot</button>
            </div>
        </form>
        </div>
    );
    }

    export default EditSpotForm;
