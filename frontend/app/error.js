"use client";

import React from 'react';
import NavOne from "../components/NavOne";
import Footer from "../components/Footer";
import Error from "../components/Error";

// Replaces the old exported /error/500 page; App Router renders this for
// uncaught runtime errors. Must be a client component per Next's contract.
const ErrorPage = ({ error, reset }) => {
    return (
        <>
            <NavOne />
            <Error />
            <Footer />
        </>
    );
};

export default ErrorPage;
