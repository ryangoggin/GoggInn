import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpot } from "../../store/spot";
import "./DeleteSpot.css";

function DeleteSpotModal({spotId}) {
  const dispatch = useDispatch();
//   const [deleteOpen, setDeleteOpen] = useState(false);

  const { closeModal } = useModal();

    // useEffect(() => {
    //     setDeleteOpen(false);
    // }, [closeModal]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(deleteSpot(spotId))
      .then(closeModal);
  };

  const closeDelete = (e) => {
    e.preventDefault();
    return closeModal();
  }

  return (
    <div className='delete-spot-form-container'>
        <form className="delete-spot-form" onSubmit={handleSubmit}>
        <h1 className="form-text form-header">Confirm Delete</h1>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button className="form-button form-text yes-button" type="submit">Yes (Delete Spot)</button>
        <button className="form-button form-text no-button" onClick={closeDelete}>No (Keep Spot)</button>
        </form>
    </div>
  );
}

export default DeleteSpotModal;
