import React from 'react';
import Layout from "../components/Layout";
import NavOne from "../components/NavOne";
import PageHeader from "../components/PageHeader";
import Footer from "../components/Footer";
import AwardRecipients from "../components/AwardRecipients";
import recipientsData from '../data/recipients.json';

export async function getStaticProps() {
    const recipients = [...recipientsData].sort((a, b) => Number(b.year) - Number(a.year));
    return { props: { recipients } };
}

const AwardRecipientsPage = ({ recipients }) => {
    return (
        <Layout pageTitle="Tombossa B Foundation | Scholarship | Award Recipients">
            <NavOne />
            <PageHeader title="Award Recipients" />
            <AwardRecipients recipients={recipients} />
            <Footer />
        </Layout>
    );
};

export default AwardRecipientsPage;
