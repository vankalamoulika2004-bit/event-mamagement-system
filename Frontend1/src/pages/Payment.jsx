import { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import "./Home.css";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const eventTitle =
    location.state?.eventTitle || "Featured Event Assembly";

  const ticketsCount =
    location.state?.ticketsCount || 1;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiProvider, setUpiProvider] = useState("gpay");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayNow = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px" }}>
      <div className="container d-flex justify-content-center">
        <div className="glass-panel p-4" style={{ width: "100%", maxWidth: "550px" }}>

          {success ? (
            <div className="text-center py-5">
              <div
                className="bg-success text-white d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  fontSize: "2.5rem",
                }}
              >
                ✓
              </div>

              <h2>Payment Successful!</h2>
              <p className="text-secondary">
                Your booking is confirmed for <b>{eventTitle}</b>
              </p>

              {/* LINK BUTTON TO MY BOOKINGS */}
              <Link to="/my-bookings" className="btn-grad mt-3 d-inline-block">
                View My Bookings →
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePayNow}>
              <h3 className="mb-3">Secure Checkout</h3>

              <p className="text-secondary">
                {eventTitle} - {ticketsCount} Ticket(s)
              </p>

              <button
                type="submit"
                disabled={processing}
                className="btn-grad w-100 mt-3"
              >
                {processing ? "Processing..." : "Pay Now"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Payment;