import React from 'react';
import Layout from "../../components/Layout";
import NavOne from "../../components/NavOne";
import Footer from "../../components/Footer";
import Error from "../../components/Error";

const ErrorPage = () => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Error">
            <NavOne />
            <Error />
            <Footer />
        </Layout>
    );
};

export default ErrorPage;
