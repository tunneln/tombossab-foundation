import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const useDonorboxScript = () => {
    const router = useRouter();

    useEffect(() => {

        // Dynamically load DonorBox script (if not already loaded)
        const handleRouteChange = () => {
            if (!document.getElementById('donorbox-widget')) {
                const widgetScript = document.createElement('script');
                widgetScript.id = 'donorbox-widget';
                widgetScript.src = 'https://donorbox.org/widget.js';
                widgetScript.paypalExpress =  true; // Enables PayPal Express Checkout
                widgetScript.async = true;

                document.body.appendChild(widgetScript);
            }
            
            // Configure Donorbox popup trigger
            window.DonorBox = { widgetLinkClassName: 'custom-dbox-popup' };

            const donorBoxPopup = document.getElementById('donorbox-popup-button-installer');
            if (!donorBoxPopup) {
                const popupScript = document.createElement('script');
                popupScript.id = 'donorbox-popup-button-installer';
                popupScript.src = 'https://donorbox.org/install-popup-button.js';
                popupScript.async = true;
                popupScript.dataset.href = 'https://donorbox.org/scholarship-fund-73?default_interval=o'; 
                popupScript.dataset.reminderWidgetEnabled = true;
                popupScript.dataset.style = 'background: rgb(227, 105, 85); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: none; font-size: 16px; padding: 8px 22px 8px 18px; border-radius: 0px 0px 5px 5px; gap: 8px; width: fit-content; line-height: 24px; position: fixed; top: 50%; transform-origin: center center; z-index: 9999; overflow: hidden; left: 20px; transform: translate(-50%, -50%) rotate(-90deg);';
                popupScript.dataset.imgSrc = 'https://donorbox.org/images/white_logo.svg';

                document.body.appendChild(popupScript);    
            }

            console.log("re render");
        };
        
        handleRouteChange();
        
        return () => { };
      }, []);
};
