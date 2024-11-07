import React from 'react';

const Map = () => {
    return (
        <div>
        <section className="map-area">
            <div id="map">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d755.1299010074317!2d-73.94342139999999!3d40.7945743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f6047283d5b1%3A0x764cf39ea0ddf53a!2sMirada%2C%20161%20E%20110th%20St%2C%20New%20York%2C%20NY%2010029!5e0!3m2!1sen!2sus!4v1729579278871!5m2!1sen!2sus" className="map" allowFullScreen="">

                </iframe>
            </div>
        </section>

        <style jsx>{`
           .map {
                width: 100%;
                height: 100%
           } 
        `}</style>
        </div>
    );
};

export default Map;
