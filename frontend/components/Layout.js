import React from 'react';
import Head from 'next/head';

const Layout = (props) => {

    return (
        <div>
            <Head>
                {/* <!-- Primary Meta Tags --> */}
                <title>{props.pageTitle}</title>
                <meta name="title" content={props.pageTitle} />

                <meta charSet="UTF-8" />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Empowering Eritrean and East African communities through education, support, and opportunity." />

                {/* <!-- Open Graph / Facebook --> */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://tombossabfoundation.org/" />
                <meta property="og:title" content="Tombossa B Foundation" />
                <meta property="og:description" content="Empowering Eritrean and East African communities through education, support, and opportunity." />
                <meta property="og:image" content="/images/link-preview.png" />

                {/* <!-- Twitter --> */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://tombossabfoundation.org/" />
                <meta property="twitter:title" content="Tombossa B Foundation" />
                <meta property="twitter:description" content="Empowering Eritrean and East African communities through education, support, and opportunity." />
                <meta property="twitter:image" content="/images/link-preview.png" />

            </Head>

            { props.children }


            <script src="/plugins/accordion.min.js"></script>
            <script src="/plugins/glightbox.min.js"></script>

        </div>
    )
}
export default Layout;