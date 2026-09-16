function Loader({ message = "Loading..." }) {
  return (
    <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center">
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="mt-3 text-secondary" style={{ fontSize: "0.95rem", fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}

export default Loader;