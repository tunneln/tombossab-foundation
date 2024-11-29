import React from 'react';
import Head from 'next/head';

const Layout = (props) => {

    return (
        <div>
            <Head>
                <title>{props.pageTitle}</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            </Head>

            { props.children }


            <script src="/plugins/accordion.min.js"></script>
            <script src="/plugins/glightbox.min.js"></script>

        </div>
    )
}
export default Layout;