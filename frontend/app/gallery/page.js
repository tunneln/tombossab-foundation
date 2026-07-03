import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import Gallery from "../../components/Gallery";

export const metadata = { title: "Tombossa B Foundation | Gallery" };

const GalleryPage = () => {
    return (
        <>
            <NavOne />
            <PageHeader title="Gallery" />
            <Gallery />
            <Footer />
        </>
    );
};

export default GalleryPage;
