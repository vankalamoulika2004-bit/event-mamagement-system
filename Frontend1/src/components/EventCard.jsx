import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card p-3 shadow">
        <h4>{event.title}</h4>

        <p>{event.description}</p>

        <p>Date: {event.date}</p>

        <Link
          to={`/event/${event._id}`}
          className="btn btn-primary"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;