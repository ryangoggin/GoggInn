// Feature 4: Manage Spots
import React from "react";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useEffect, useState, useRef } from 'react';
import { getUserSpots, clearSingleSpot } from '../../store/spot';
import ManageSpotsItem from '../ManageSpotsItem';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import DeleteSpotModal from "../DeleteSpotModal";
import './ManageSpots.css';



function ManageSpots() {
    const userSpots = useSelector(state => state.spot.userSpots);
    // userSpots starts as null, use conditional to avoid putting undefined in Object.values
    let userSpotsArr;
    if (userSpots !== null) {
        userSpotsArr = Object.values(userSpots);
    }

    const dispatch = useDispatch();
    const history = useHistory();

    //use the following for delete spot modal
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
            setShowMenu(false);
        }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    //populate store with allSpots on render
    useEffect(() => {
        dispatch(getUserSpots());
        dispatch(clearSingleSpot());
        // return () => {
        //     dispatch(clearSingleSpot());
        // }
    }, [dispatch]);

    const sessionUser = useSelector(state => state.session.user);

    // redirect to / if no user logged in
    if (sessionUser === null) history.push(`/`);

    if (!userSpotsArr) {
        return null;
    }

    return (
        <>
            <div className="manage-spots-page-container">
                <h1 className="manage-spots-header">Manage Spots</h1>
                <button className="create-new-spot-button">
                        <Link exact="true" to="/spots/new" className="create-new-spot nav-text">
                        Create a New Spot
                        </Link>
                </button>
                <div className='user-spots-container'>
                    {userSpotsArr.map((spot) => {
                    return (
                        <div key={spot.id} className='user-spot-item-container'>
                            <div className='user-spot-item'>
                                <Link key={spot.id} exact="true" to={`/spots/${spot.id}`} style={{ textDecoration: 'none' }}>
                                    <ManageSpotsItem spot={spot}/>
                                </Link>
                                <div className='spot-info-bottom'>
                                    <Link key={spot.id} exact="true" to={`/spots/${spot.id}`} style={{ textDecoration: 'none' }}>
                                        <b>${Number.parseFloat(spot.price).toFixed(2)}</b>/night
                                    </Link>
                                    <div className='update-delete-container'>
                                    <button className='update-button'>
                                        <Link exact="true" to={`/spots/${spot.id}/edit`} className="update-spot">
                                            Update
                                        </Link>
                                    </button>
                                    <button className='delete-button'>
                                    <OpenModalMenuItem
                                        itemText="Delete"
                                        onItemClick={closeMenu}
                                        modalComponent={<DeleteSpotModal spotId={spot.id} />}
                                    />
                                    </button>
                                </div>
                                </div>
                            </div>
                        </div>

                    );
                    })}
                </div>
            </div>
        </>
    )
};

export default ManageSpots;
