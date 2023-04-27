import React from 'react';
import './Footer.css';

function LandingPageFooter(){
    function handleLinkedIn() {
        window.open("https://www.linkedin.com/in/ryangoggin20/", "_blank");
    }

    function handleGithub() {
        window.open("https://github.com/ryangoggin", "_blank");
    }

    function handlePortfolio() {
        window.open("https://ryangoggin.github.io/", "_blank");
    }

    function handlePixelPal() {
        window.open("https://pixel-pal.onrender.com/", "_blank");
    }

    function handleGoggbook() {
        window.open("https://goggbook.onrender.com/", "_blank");
    }

    return (
        <div className='footer-container'>
            <div className='footer-left'>
                <div className='footer-left-top'>
                    <div className='footer-copyright'>
                        <p className='footer-text'>
                        Ryan Goggin © 2023
                        </p>
                    </div>
                    <button className='footer-button' onClick={handleLinkedIn}>
                        LinkedIn
                    </button>
                    <button className='footer-button' onClick={handleGithub}>
                        Github
                    </button>
                    <button className='footer-button' onClick={handlePortfolio}>
                        Portfolio
                    </button>
                </div>
                <div className='footer-left-bottom'>
                    <p className='footer-text'>
                        JavaScript
                    </p>
                    <p className='footer-text'>
                        React
                    </p>
                    <p className='footer-text'>
                        Redux
                    </p>
                    <p className='footer-text'>
                        Express
                    </p>
                    <p className='footer-text'>
                        Sequelize
                    </p>
                    <p className='footer-text'>
                        SQL
                    </p>
                    <p className='footer-text'>
                        Node
                    </p>
                    <p className='footer-text'>
                        HTML
                    </p>
                    <p className='footer-text'>
                        CSS
                    </p>
                    <p className='footer-text'>
                        Github
                    </p>
                </div>
            </div>
            <div className='footer-right'>
                <p className='footer-text'>
                    Also Check Out:
                </p>
                <button className='footer-button' onClick={handleGoggbook}>
                    GoggBook
                </button>
                <button className='footer-button' onClick={handlePixelPal}>
                    PixelPal
                </button>
            </div>
        </div>
    );
}

export default LandingPageFooter;
