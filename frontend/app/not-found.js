import React from 'react';
import NavOne from "../components/NavOne";
import Footer from "../components/Footer";
import Error from "../components/Error";

export const metadata = { title: "Tombossa B Foundation | Error" };

// Replaces the old exported /error/404 page; App Router serves this for any
// unmatched route with the full site chrome.
const NotFound = () => {
    return (
        <>
            <NavOne />
            <Error />
            <Footer />
        </>
    );
};

export default NotFound;
