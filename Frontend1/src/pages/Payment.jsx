import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState("Credit/Debit Card");
  const [cardDetails, setCardDetails] = useState({ cardNumber: "", expiryDate: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [bankName, setBankName] = useState("");

  const banksList = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Punjab National Bank",
    "Kotak Mahindra Bank"
  ];

  useEffect(() => {
    async function fetchBookingDetails() {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8080/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooking(res.data);
      } catch (err) {
        console.error("Error loading booking details for checkout:", err);
        setErrorMsg(err.response?.data?.message || "Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }

    setTimeout(() => {
      fetchBookingDetails();
    }, 0);
  }, [id, navigate]);

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (paymentMethod === "Credit/Debit Card") {
      const { cardNumber, expiryDate, cvv } = cardDetails;
      const cleanCard = cardNumber.replace(/\s+/g, "");
      if (!/^\d{16}$/.test(cleanCard)) {
        setErrorMsg("Card number must be exactly 16 digits.");
        return false;
      }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
        setErrorMsg("Expiry date must be in MM/YY format.");
        return false;
      }
      if (!/^\d{3,4}$/.test(cvv)) {
        setErrorMsg("CVV must be 3 or 4 digits.");
        return false;
      }
    } else if (paymentMethod === "UPI") {
      if (!upiId) {
        setErrorMsg("UPI ID is required.");
        return false;
      }
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        setErrorMsg("Invalid UPI ID format. Example: name@okbank");
        return false;
      }
    } else if (paymentMethod === "Net Banking") {
      if (!bankName) {
        setErrorMsg("Please select a bank for net banking.");
        return false;
      }
    }
    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) return;

    setProcessing(true);
    const token = localStorage.getItem("token");
    const totalAmount = (booking?.event?.price || 0) * (booking?.ticketsCount || 1);

    try {
      await axios.post(
        "http://localhost:8080/api/payments",
        {
          bookingId: id,
          amount: totalAmount,
          paymentMethod,
          cardDetails: paymentMethod === "Credit/Debit Card" ? cardDetails : undefined,
          upiId: paymentMethod === "UPI" ? upiId : undefined,
          bankName: paymentMethod === "Net Banking" ? bankName : undefined
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Payment transaction failed. Please check inputs and try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="home-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading checkout...</span>
        </div>
      </div>
    );
  }

  const ticketPrice = booking?.event?.price || 0;
  const ticketsCount = booking?.ticketsCount || 1;
  const totalAmount = ticketPrice * ticketsCount;

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      {/* Background glow blobs */}
      <div className="glow-blob-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-3" style={{ bottom: "5%" }}></div>
      </div>

      <div className="container position-relative d-flex justify-content-center" style={{ zIndex: 2 }}>
        <div className="glass-panel text-start p-4 p-md-5" style={{ width: "100%", maxWidth: "600px" }}>
          
          {success ? (
            <div className="text-center py-5">
              <div
                className="bg-success text-white d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  fontSize: "2.5rem",
                  boxShadow: "0 4px 15px rgba(25, 135, 84, 0.4)"
                }}
              >
                ✓
              </div>

              <h2 className="font-heading fw-bold">Payment Successful!</h2>
              <p className="text-secondary mt-2">
                Your transaction has been recorded. Seats are officially secured for: <br />
                <strong className="text-white" style={{ fontSize: "1.1rem" }}>{booking?.event?.title}</strong>
              </p>

              <div className="glass-panel p-3 my-4 text-start" style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                <div><strong>Attendee:</strong> {booking?.attendeeName || booking?.user?.name}</div>
                <div><strong>Tickets:</strong> {ticketsCount} Seat(s)</div>
                <div><strong>Amount Paid:</strong> ₹{totalAmount}</div>
                <div><strong>Method:</strong> {paymentMethod}</div>
              </div>

              <Link to="/my-bookings" className="btn-grad mt-3 d-inline-block text-decoration-none py-3 px-5">
                View My Bookings &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePayment}>
              <div className="text-center mb-4">
                <span style={{ fontSize: "2.5rem" }}>🔒</span>
                <h2 className="font-heading fw-bold mt-2" style={{ letterSpacing: "-0.5px" }}>Secure Gateway Checkout</h2>
                <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
                  Complete booking payments with end-to-end encryption.
                </p>
              </div>

              {/* BOOKING INFO TICKET BAR */}
              <div
                className="p-3 mb-4"
                style={{
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px",
                }}
              >
                <h5 className="font-heading fw-bold mb-3 text-pink" style={{ color: "var(--accent-pink)" }}>
                  📝 Booking Details
                </h5>
                <div className="row g-2" style={{ fontSize: "0.9rem", color: "#cbd5e1" }}>
                  <div className="col-6"><strong>Event Name:</strong></div>
                  <div className="col-6 text-white text-end">{booking?.event?.title}</div>
                  
                  <div className="col-6"><strong>Ticket Count:</strong></div>
                  <div className="col-6 text-white text-end">{ticketsCount} Ticket(s)</div>

                  <div className="col-6"><strong>User Name:</strong></div>
                  <div className="col-6 text-white text-end">{booking?.user?.name}</div>

                  <div className="col-6"><strong>User Email:</strong></div>
                  <div className="col-6 text-white text-end">{booking?.user?.email}</div>

                  <div className="col-6"><strong>Ticket Price:</strong></div>
                  <div className="col-6 text-cyan text-end fw-bold" style={{ color: "var(--accent-cyan)" }}>
                    ₹{ticketPrice}
                  </div>
                  
                  <div className="col-12"><hr className="my-2" style={{ borderColor: "rgba(255,255,255,0.08)" }} /></div>

                  <div className="col-6" style={{ fontSize: "1.05rem", fontWeight: 700 }}>Total Amount:</div>
                  <div className="col-6 text-white text-end fw-bold" style={{ fontSize: "1.05rem" }}>
                    ₹{totalAmount}
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 text-center" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* PAYMENT METHODS SELECTOR TABS */}
              <div className="mb-4">
                <label className="mb-2" style={{ fontSize: "0.85rem", fontWeight: 600, color: "#cbd5e1" }}>
                  Select Payment Method
                </label>
                <div className="d-flex gap-2">
                  {["Credit/Debit Card", "UPI", "Net Banking"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method);
                        setErrorMsg("");
                      }}
                      className="btn flex-fill py-2"
                      style={{
                        background: paymentMethod === method ? "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)" : "rgba(255,255,255,0.04)",
                        border: paymentMethod === method ? "none" : "1px solid var(--glass-border)",
                        color: "white",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        borderRadius: "10px",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* CARD DETAILS LAYOUT */}
              {paymentMethod === "Credit/Debit Card" && (
                <div className="p-3 mb-4" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                  <div className="mb-3">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 1234 5678"
                      maxLength="19"
                      value={cardDetails.cardNumber}
                      onChange={(e) => {
                        // format with spaces
                        const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        setCardDetails({ ...cardDetails, cardNumber: val });
                      }}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        marginTop: "5px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--glass-border)",
                        color: "white",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div className="row">
                    <div className="col-6 mb-2">
                      <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Expiration (MM/YY)</label>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardDetails.expiryDate}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "");
                          if (val.length > 2) {
                            val = val.substring(0, 2) + "/" + val.substring(2, 4);
                          }
                          setCardDetails({ ...cardDetails, expiryDate: val });
                        }}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          marginTop: "5px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid var(--glass-border)",
                          color: "white",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                    <div className="col-6 mb-2">
                      <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        placeholder="•••"
                        maxLength="4"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          marginTop: "5px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid var(--glass-border)",
                          color: "white",
                          borderRadius: "8px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI INPUT */}
              {paymentMethod === "UPI" && (
                <div className="p-3 mb-4" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                  <div className="mb-2">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>UPI ID</label>
                    <input
                      type="text"
                      placeholder="username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        marginTop: "5px",
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--glass-border)",
                        color: "white",
                        borderRadius: "8px",
                      }}
                    />
                    <small className="text-secondary mt-1 d-block" style={{ fontSize: "0.75rem" }}>
                      Provide your valid UPI handle (e.g. name@okhdfc, name@ybl, name@paytm)
                    </small>
                  </div>
                </div>
              )}

              {/* NET BANKING BANK LIST */}
              {paymentMethod === "Net Banking" && (
                <div className="p-3 mb-4" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                  <div className="mb-2">
                    <label style={{ fontSize: "0.82rem", color: "#94a3b8" }}>Select Bank</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        marginTop: "5px",
                        background: "rgba(7, 7, 18, 0.95)",
                        border: "1px solid var(--glass-border)",
                        color: "white",
                        borderRadius: "8px",
                      }}
                    >
                      <option value="">-- Choose Your Bank --</option>
                      {banksList.map((bk) => (
                        <option key={bk} value={bk}>{bk}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="btn-grad w-100 py-3 text-center justify-content-center"
              >
                {processing ? "Authorizing transaction..." : `CONFIRM AND PAY ₹${totalAmount} 🔒`}
              </button>

              <div className="text-center mt-3">
                <Link to="/my-bookings" style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "none" }}>
                  Discard and return
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default Payment;