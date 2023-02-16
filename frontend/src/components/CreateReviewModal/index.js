import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createSpotReview } from "../../store/review";
import "./CreateReview.css";

function CreateReviewModal({spotId}) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");

  const [ rating, setRating ] = useState(0);
  const [hover, setHover] = useState(0);
  const starArr = ["", "", "", "", ""];
  const sessionUser = useSelector(state => state.session.user);
  const spot = useSelector(state => state.spot.singleSpot);

  const { closeModal } = useModal();

  if (spot === null) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
        review,
        stars: rating
    }

    //increment numReviews so it rerenders up to date
    spot.numReviews++;

    dispatch(createSpotReview(newReview, spotId, sessionUser))
      .then(closeModal);
  };

  return (
    <div className='delete-spot-form-container'>
        <form className="delete-spot-form" onSubmit={handleSubmit}>
        <h1 className="form-text form-header">How was your stay?</h1>
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
        <button className="form-button form-text submit-review-button" type="submit" disabled={review.length < 10}>Submit Your Review</button>
        </form>
    </div>
  );
}

export default CreateReviewModal;
