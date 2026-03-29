import { useEffect } from "react";

export default function usePaystack() {
  useEffect(() => {
    if (window.PaystackPop) return;

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
}
