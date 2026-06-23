import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import newslettersData from '../data/newsletters.json';

export async function getStaticProps() {
    const newsletters = [...newslettersData].sort((a, b) => b.date.localeCompare(a.date));
    return { props: { newsletters } };
}

const NewslettersPage = ({ newsletters }) => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Newsletters">
            <NavOne />
            <PageHeader title="Newsletters" />
            <Newsletter newsletters={newsletters} />
            <Footer />
        </Layout>
    );
};

export default NewslettersPage;
