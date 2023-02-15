import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditSpotForm from ".";
import { getSpotDetail } from "../../store/spot";

function GetEditSpot() {
    const dispatch = useDispatch();
    const { spotId } = useParams();

    useEffect(() => {
        dispatch(getSpotDetail(spotId));
    }, [dispatch, spotId]);

    const editSpot = useSelector(state => state.spot.singleSpot);

    if (editSpot) {
        return (
            <EditSpotForm editSpot={editSpot} />
        );
    } else {
        return null;
    }

}

export default GetEditSpot;
