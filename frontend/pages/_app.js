import '../node_modules/react-modal-video/scss/modal-video.scss';
import { DonateProvider } from '../components/DonateProvider';

// This default export is required in a new `pages/_app.js` file.
// DonateProvider lives here (above the swapped page content) so its single donate
// modal — and the donor's in-progress form — persist across client-side navigation.
export default function MyApp({ Component, pageProps }) {
    return (
        <DonateProvider>
            <Component {...pageProps} />
        </DonateProvider>
    );
}