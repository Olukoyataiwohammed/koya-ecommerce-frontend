import { useNavigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

export default function CheckoutButton({ showGuestFormInline = false }) {
  const navigate = useNavigate();
//   const { user } = useAuth();

  // Cart page behavior → navigate only
  if (!showGuestFormInline) {
    return (
      <button onClick={() => navigate("/checkout")}>
        Checkout
      </button>
    );
  }

  // Checkout page behavior → form shown there
  return null;
}
