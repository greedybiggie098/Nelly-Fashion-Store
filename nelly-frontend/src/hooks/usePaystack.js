import { useEffect } from 'react';

const PAYSTACK_PUBLIC_KEY = 'pk_test_f69bab7ac9adbe93ef6020842819d017e3beb13f';

export const usePaystack = () => {
  useEffect(() => {
    // Load Paystack inline script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializePayment = (config) => {
    if (!window.PaystackPop) {
      console.error('Paystack script not loaded');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: config.email,
      amount: config.amount * 100, // Convert to kobo (smallest currency unit)
      currency: 'NGN',
      ref: config.reference || '' + Math.floor((Math.random() * 1000000000) + 1),
      metadata: config.metadata || {},
      callback: function(response) {
        if (config.onSuccess) {
          config.onSuccess(response);
        }
      },
      onClose: function() {
        if (config.onClose) {
          config.onClose();
        }
      }
    });

    handler.openIframe();
  };

  return { initializePayment };
};

export default usePaystack;
