import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { deleteReview } from "../../store/review";
import "./DeleteReview.css";

function DeleteReviewModal({reviewId}) {
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spot.singleSpot);
  const delReview = useSelector(state => state.review.spot[reviewId]);

  const { closeModal } = useModal();

  if (spot === null) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    //get cumulative rating before decrementing
    let cumulativeRating = parseFloat(spot.avgStarRating) * parseFloat(spot.numReviews);

    //decrement numReviews so it rerenders up to date
    spot.numReviews--;

    //update avgRating as well (subtract deleted rating from cumulative, divide by newly decrememnted numReviews)
    spot.avgStarRating = (cumulativeRating - delReview.stars)/spot.numReviews;
    //set to 1 decimal place for consistency
    spot.avgStarRating = spot.avgStarRating.toFixed(1);

    dispatch(deleteReview(reviewId))
      .then(closeModal);
  };

  const closeDelete = (e) => {
    e.preventDefault();
    return closeModal();
  }

  return (
    <div className='delete-review-form-container'>
        <form className="delete-review-form" onSubmit={handleSubmit}>
        <h1 className="form-text form-header">Confirm Delete</h1>
        <p>Are you sure you want to delete this review?</p>
        <button className="form-button form-text yes-button" type="submit">Yes (Delete Review)</button>
        <button className="form-button form-text no-button" onClick={closeDelete}>No (Keep Review)</button>
        </form>
    </div>
  );
}

export default DeleteReviewModal;
