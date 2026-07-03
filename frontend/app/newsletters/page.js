import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import Newsletter from "../../components/Newsletter";
import { getNewsletters } from '../../lib/api';

export const metadata = { title: "Tombossa B Foundation | Newsletters" };

const NewslettersPage = async () => {
    const newsletters = await getNewsletters();
    return (
        <>
            <NavOne />
            <PageHeader title="Newsletters" />
            <Newsletter newsletters={newsletters} />
            <Footer />
        </>
    );
};

export default NewslettersPage;
