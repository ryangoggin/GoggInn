import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spot';

const SpotDetails = () => {
  const { spotId } = useParams();
  const spotsObj = useSelector(state => state.spot.allSpots);

  const dispatch = useDispatch();

  // populate store with allSpots on render in case of refresh on spotDetails page
  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  // return null if sportsObj is null from initialState on page refresh
  if (spotsObj === null) return null;
  const spot = spotsObj[spotId];

  return (
    <section>
      ID: {spot.id}
      <br/>
      Name: {spot.name}
      <br/>
      Price: {spot.price}
      <br/>
      <Link to="/">Back to Home</Link>
    </section>
  );
}

export default SpotDetails;
