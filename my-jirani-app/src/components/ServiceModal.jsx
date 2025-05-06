import React from 'react';

const ServiceModal = ({ service, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{service.name}</h2>
        <img 
          src={service.image} 
          alt={service.name} 
          style={{ width: "100%", height: "300px", objectFit: "cover" }}
        />
        <p>{service.description}</p>
        <h3>Price: ${service.price}</h3>
        <button onClick={() => alert(`Booking ${service.name}...`)}>Book Now</button>
      </div>
    </div>
  );
};

export default ServiceModal;