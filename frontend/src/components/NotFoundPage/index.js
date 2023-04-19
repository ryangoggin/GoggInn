import React from 'react';
import { useHistory } from 'react-router-dom';
import './NotFoundPage.css';
import notFoundGif from '../../static/NotFoundPage/404.gif';


function NotFoundPage() {
    const history = useHistory();

    const returnHome = async (e) => {
        e.preventDefault();
        history.push("/");
    }

    return (
        <>
            <div className='not-found-container'>
                <img className='not-found-gif' src={notFoundGif} alt="not found" />
                <div className='not-found-text-container'>
                    <h2 className='whoops-text'>Whoops!</h2>
                    <p className='cant-find-text'>
                        We can't seem to find the page you're looking for,
                        here's a link back to GoggInn
                    </p>
                    <button className='return-button' onClick={returnHome}>
                        Return to GoggInn
                    </button>
                </div>
            </div>
        </>
    );
}

export default NotFoundPage;
