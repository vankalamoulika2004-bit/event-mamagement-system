import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Home.css"; // Reuse styling variables

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallbacks if backend event doesn't exist
  const fallbackEvents = [
    {
      id: "fallback-1",
      title: "Global Tech Summit 2026",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      description: "Join tech pioneers and global innovators to discuss generative intelligence, autonomous agents, and next-gen cloud structures. Engage in high-impact panels, live developer labs, and collaborative breakouts that redefine technical frontiers.",
      location: "San Francisco, CA",
      date: "2026-06-15",
      category: "Workshops",
      organizerName: "Global Tech Alliance",
      organizerEmail: "summit@techalliance.org",
      organizerPhone: "+1 (800) 555-0199",
      agenda: "09:00 AM - Opening Keynote\n11:00 AM - AI & Agents Round Table\n02:00 PM - Dev Sandbox Labs\n05:00 PM - Networking Cocktails",
      refundPolicy: "Full refund up to 7 days before event commencement. No-shows are ineligible for refunds."
    },
    {
      id: "fallback-2",
      title: "Summer Symphony Orchestra",
      image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1200&auto=format&fit=crop",
      description: "Experience a breathtaking evening of classical symphonies and modern arrangements under the starry Boston sky. Featuring world-renowned soloists and an award-winning orchestra ensemble.",
      location: "Symphony Hall, Boston",
      date: "2026-07-08",
      category: "Concerts",
      organizerName: "Boston Arts Association",
      organizerEmail: "events@bostonarts.org",
      organizerPhone: "+1 (800) 555-0144",
      agenda: "06:30 PM - Gate Entry & Seating\n07:30 PM - Act I: Symphony No. 5\n08:45 PM - Intermission\n09:15 PM - Act II: Contemporary Arrangements",
      refundPolicy: "Tickets are exchangeable for alternate dates but strictly non-refundable."
    },
    {
      id: "fallback-3",
      title: "National Health & Wellness Expo",
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop",
      description: "Access free health diagnostics, professional wellness workshops, nutrition guidance, and yoga masterclasses. Learn healthy living practices from leading clinical practitioners and clinical coaches.",
      location: "Central Park, NY",
      date: "2026-08-22",
      category: "Health Camps",
      organizerName: "National Health Foundation",
      organizerEmail: "care@healthfoundation.org",
      organizerPhone: "+1 (800) 555-0177",
      agenda: "08:00 AM - Yoga Masterclass\n10:00 AM - Diagnostic Stations Open\n01:00 PM - Nutritional Guidance Forum\n04:00 PM - Wellness Workshops Wrap-up",
      refundPolicy: "Free admission. Event registration secures diagnostic session queuing order."
    },
     {
      id: "fallback-4",
      title: "Decentralized Startup Summit",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800&auto=format&fit=crop%22",
      description: "Accelerate your project with Venture Capitalist panels, investment roundtables, pitch boards, and incubator connections.",
      location: "Silicon Valley, CA",
      date: "2026-09-10",
      category: "Seminars",
      organizerName: "Startup Growth hub",
      organizerEmail: "organizer@startupgrowthhub.org",
      organizerPhone: "+91 98765 43210",
      agenda: "09:00 AM - Registration\n10:00 AM - Keynote Session\n11:30 AM - Startup Pitching\n01:00 PM - Lunch Break\n02:00 PM - Funding Workshop\n04:00 PM - Networking Session\n05:30 PM - Closing Remarks.",
      refundPolicy: "Full refund available up to 7 days before the event; no refunds thereafter."
    },
      {
      id: "fallback-5",
      title: "Elysium College Carnivals",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
      description: "Join the ultimate collegiate celebration with live concerts, inter-college drama stages, competitive sports, and DJ night.",
      location: "State University Gym",
      date: "2026-10-04",
      category: "College Fests",
      organizerName:"Campus Events Committee",
organizerEmail:"collegefest2026@demoevent.com",
organizerPhone: "+91 9876543210",
agenda:"09:00 AM - Registration\n10:00 AM - Opening Ceremony\n11:00 AM - Cultural Performances\n01:00 PM - Lunch Break\n02:00 PM - Competitions\n04:00 - PM Celebrity Guest Session\n06:00 PM - Prize Distribution\n07:00 PM - Closing Ceremony",
refundPolicy:"Tickets are refundable up to 5 days before the event; no refunds after that."
    },
      {
      id: "fallback-6",
      title: "Tree plantation drive",
      image: "https://media.istockphoto.com/id/2221018480/photo/two-people-are-planting-a-tree-in-the-dirt.webp?a=1&b=1&s=612x612&w=0&k=20&c=_CCyjgyhw0tFf0Dl8OGZlXizCr7QOuGwXO7ujY8zEzM=",
      description: "a collaborative community initiative aimed at planting saplings to combat climate change, restore ecosystems, and promote environmental awareness.",
      location: "Aditya Institute Techonology And Management",
      date: "2026-11-04",
      category: "Tree plantation",
      organizerName: "Environmental Club",
      organizerEmail: "envclub@aditya.edu.in",
      organizerPhone: "+91 9876543210",
      agenda: "09:00 AM - Registration\n10:00 AM - Welcome Speech\n11:00 AM - Tree Planting Activity\n01:00 PM - Lunch Break\n02:00 PM - Environmental Awareness Talk\n04:00 PM - Closing Remarks",
      refundPolicy: "Tickets are refundable up to 5 days before the event; no refunds after that."
    },
  ];

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/events/event/${id}`
      );
      if (res.data) {
        setEvent(res.data);
      } else {
        findFallback();
      }
    } catch (error) {
      console.log("Error fetching event, matching fallbacks:", error);
      findFallback();
    } finally {
      setLoading(false);
    }
  };

  const findFallback = () => {
    const matched = fallbackEvents.find((evt) => evt.id === id);
    // fallback default if matching fails
    setEvent(matched || fallbackEvents[0]);
  };

  if (loading) {
    return (
      <div className="home-wrapper d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="home-wrapper d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <h2>Event Not Found</h2>
        <Link to="/events" className="btn-grad mt-3">Back to catalog</Link>
      </div>
    );
  }

  return (
    <div className="home-wrapper" style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      {/* Background glow blobs */}
      <div className="glow-blob-container">
        <div className="glow-blob blob-1"></div>
        <div className="glow-blob blob-3" style={{ bottom: "5%" }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="mb-4">
          <Link to="/events" style={{ color: "var(--accent-pink)", textDecoration: "none", fontWeight: 600 }}>
            &larr; Back to Events catalog
          </Link>
        </div>

        <div className="glass-panel p-0 overflow-hidden" style={{ borderRadius: "24px" }}>
          {/* Hero Banner */}
          <div style={{ height: "420px", position: "relative", width: "100%" }}>
            <img
              src={event.image}
              alt={event.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(7, 7, 18, 0.95) 0%, rgba(7, 7, 18, 0.4) 70%, transparent 100%)",
              }}
            ></div>

            <div className="position-absolute bottom-0 start-0 p-4 p-md-5 text-start w-100">
              <span className="event-category-tag" style={{ position: "static", marginBottom: "15px", display: "inline-block" }}>
                {event.category || "Featured"}
              </span>
              <h1 className="font-heading" style={{ fontSize: "3.2rem", fontWeight: 900, letterSpacing: "-1px", lineHeight: "1.1" }}>
                {event.title}
              </h1>
              <div className="d-flex flex-wrap gap-4 mt-3" style={{ fontSize: "0.95rem", color: "#cbd5e1" }}>
                <span>📅 {event.date}</span>
                <span>📍 {event.location}</span>
              </div>
            </div>
          </div>

          {/* Main Info Blocks */}
          <div className="p-4 p-md-5">
            <div className="row g-5">
              <div className="col-lg-8 text-start">
                <h3 className="font-heading fw-bold mb-3" style={{ color: "var(--accent-purple)" }}>About the Event</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: "1.8", whiteSpace: "pre-line" }}>
                  {event.description}
                </p>

                {event.agenda && (
                  <div className="mt-5">
                    <h3 className="font-heading fw-bold mb-3" style={{ color: "var(--accent-purple)" }}>📋 Event Agenda</h3>
                    <div
                      className="glass-panel p-4"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        whiteSpace: "pre-line",
                        color: "var(--text-secondary)",
                        lineHeight: "1.7",
                      }}
                    >
                      {event.agenda}
                    </div>
                  </div>
                )}

                {event.refundPolicy && (
                  <div className="mt-5">
                    <h3 className="font-heading fw-bold mb-3" style={{ color: "var(--accent-pink)" }}>🛡️ Refund Policy</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", lineHeight: "1.6" }}>
                      {event.refundPolicy}
                    </p>
                  </div>
                )}
              </div>

              {/* Sidebar Info & Booking Trigger */}
              <div className="col-lg-4 text-start">
                <div className="glass-panel p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <h4 className="font-heading fw-bold mb-4">Registration Summary</h4>

                  <div className="mb-4">
                    <div className="text-secondary" style={{ fontSize: "0.85rem" }}>TICKET PRICE</div>
                    <div className="font-heading" style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--accent-cyan)" }}>
                      FREE REGISTER
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-secondary" style={{ fontSize: "0.85rem" }}>ORGANIZER DETAILS</div>
                    <div className="mt-2" style={{ fontSize: "0.92rem" }}>
                      <strong>👤 Name:</strong> {event.organizerName || "Evinto Admin"}<br />
                      <strong>📧 Email:</strong> {event.organizerEmail || "support@evinto.com"}<br />
                      <strong>📞 Phone:</strong> {event.organizerPhone || "+91 98765 43210"}
                    </div>
                  </div>

                  <Link to={`/bookingEvent/${id}`} className="btn-grad w-100 text-center justify-content-center py-3">
                    🎟️ Book Your Seats Now
                  </Link>

                  <div className="text-center text-secondary mt-3" style={{ fontSize: "0.8rem" }}>
                    * Seats are limited. Registration will generate a dynamic booking reference.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;