import React from 'react';

const Map = () => {
    return (
        <div>
        <section className="map-area">
            <div id="map">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.3861003457!2d-96.77716002363458!3d32.94081427359561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c218a9fa12ba3%3A0x1c26ca6fba0630cf!2sTombossa%20B%20Foundation!5e0!3m2!1sen!2sus!4v1733611305898!5m2!1sen!2sus" className="map" allowFullScreen>
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
