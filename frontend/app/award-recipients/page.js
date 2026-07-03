import React from 'react';
import NavOne from "../../components/NavOne";
import PageHeader from "../../components/PageHeader";
import Footer from "../../components/Footer";
import AwardRecipients from "../../components/AwardRecipients";
import { getRecipients } from '../../lib/api';

export const metadata = { title: "Tombossa B Foundation | Scholarship | Award Recipients" };

const AwardRecipientsPage = async () => {
    const recipients = await getRecipients();
    return (
        <>
            <NavOne />
            <PageHeader title="Award Recipients" />
            <AwardRecipients recipients={recipients} />
            <Footer />
        </>
    );
};

export default AwardRecipientsPage;
