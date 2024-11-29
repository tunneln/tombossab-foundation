import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import CauseDetails from "../components/CauseDetails";

const CauseDetailsPage = (props) => {
    return (
        <Layout pageTitle={"Tombossa B Foundation | Causes | " + props.causeTitle}>
            <NavOne />
            <PageHeader title={`Causes  |  ${props.causeTitle}`} />
            <CauseDetails title={props.causeTitle}/>
            <Footer />
        </Layout>
    );
};

export default CauseDetailsPage;