import React, { useEffect } from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createSpotReview } from "../../store/review";
import "./CreateReview.css";

function EditReviewModal({spotId}) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [ rating, setRating ] = useState(0);
  const [hover, setHover] = useState(0);
  const starArr = ["", "", "", "", ""];
  const sessionUser = useSelector(state => state.session.user);
  const spot = useSelector(state => state.spot.singleSpot);

  const { closeModal } = useModal();

  // handle errors instead of disabling submit button
  useEffect(() => {
      const valErrors = [];
      if (review.length < 10) valErrors.push("Review must be more than 10 characters");
      if (rating < 1) valErrors.push("Rating must be 1-5 stars");
      setErrors(valErrors);
  }, [review, rating]);

  if (spot === null) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    setHasSubmitted(true);

    if (errors.length > 0) {
        window.alert("Fix review errors before submitting!");
        return;
    }

    const newReview = {
        review,
        stars: rating
    }

    // make avgRating and numReviews 0 if it is NaN
    if (isNaN(spot.avgStarRating)) spot.avgStarRating = 0;
    if (isNaN(spot.numReviews)) spot.numReviews = 0;

    //get cumulative rating before incrementing
    let cumulativeRating = parseFloat(spot.avgStarRating) * parseFloat(spot.numReviews);

    //increment numReviews so it rerenders up to date
    spot.numReviews++;

    //update avgRating as well (add new rating to cumulative, divide by newly incrememnted numReviews)
    spot.avgStarRating = (cumulativeRating + rating)/spot.numReviews;
    //set to 1 decimal place for consistency
    spot.avgStarRating = spot.avgStarRating.toFixed(1);

    dispatch(createSpotReview(newReview, spotId, sessionUser))
      .then(closeModal);

    setRating(0);
    setHover(0);
    setReview("");
    setErrors([]);
    setHasSubmitted(false);
  };

  return (
    <div className='delete-spot-form-container'>
        <form className="delete-spot-form" onSubmit={handleSubmit}>
        <h1 className="form-text form-header">How was your stay?</h1>
        <ul className="errors-list">
          {hasSubmitted && errors.map((error, idx) => (
              <li key={`error${idx}`} className="errors">{error}</li>
            ))}
        </ul>
        <textarea
            className="review-textarea"
            placeholder="Leave your review here"
            value={review}
            onChange={(e) => setReview(e.target.value)}
        />
        <div className="star-rating-review-container">
            {starArr.map((starEl, index) => {
            index++;
            return (
                <button
                className="star-button"
                key={`index${index}`}
                onClick={(e) => {
                    e.preventDefault();
                    setRating(index)
                }}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
                >
                <i className={index <= (hover || rating) ? "fa-solid fa-star star-review" : "fa-regular fa-star star-review"}></i>
                </button>
            );
            })}
        <p className="stars-text"><b>Stars</b></p>
      </div>
        <button className="form-button form-text submit-review-button" type="submit" >Update Your Review</button>
        </form>
    </div>
  );
}

export default EditReviewModal;
