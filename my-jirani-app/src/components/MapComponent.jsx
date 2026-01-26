import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Haversine formula for distance calculation
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const AdjustMapBounds = ({ services }) => {
  const map = useMap();

  useEffect(() => {
    // Filter out services without valid coordinates
    const validServices = services.filter(
      (service) => service.lat != null && service.lon != null,
    );

    if (validServices.length > 0) {
      const bounds = L.latLngBounds(
        validServices.map((service) => [service.lat, service.lon]),
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [services, map]);

  return null;
};

// Add PropTypes for AdjustMapBounds
AdjustMapBounds.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number,
      lon: PropTypes.number,
    })
  ).isRequired,
};

const MapComponent = ({ services, userCoords }) => {
  const [center, setCenter] = useState([-1.286389, 36.817223]); // Default to Nairobi
  const navigate = useNavigate();

  useEffect(() => {
    if (userCoords) {
      setCenter([userCoords.lat, userCoords.lon]);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.warn("Location access denied");
        },
      );
    }
  }, [userCoords]);

  return (
    <div style={{ height: "500px", width: "100%", marginBottom: "20px" }}>
      <MapContainer
        center={center}
        zoom={14}
        className="leaflet-container"
        style={{ height: "100%", width: "100%", borderRadius: "10px" }}
      >
        {/* Add Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Dynamic Zooming */}
        <AdjustMapBounds services={services} />

        {/* Clustering */}
        <MarkerClusterGroup>
          {services
            .filter((service) => service.lat != null && service.lon != null)
            .map((service) => {
              const distance = userCoords
                ? calculateDistance(
                    userCoords.lat,
                    userCoords.lon,
                    service.lat,
                    service.lon,
                  ).toFixed(2)
                : null;

              return (
                <Marker
                  key={service.id}
                  position={[service.lat, service.lon]}
                  eventHandlers={{
                    click: () => navigate(`/service/${service.id}`),
                    mouseover: (e) => e.target.openPopup(),
                    mouseout: (e) => e.target.closePopup(),
                  }}
                >
                  <Popup>
                    <div style={{ lineHeight: "1.5" }}>
                      <strong>{service.name}</strong> <br />
                      {service.description} <br />
                      <strong>Price:</strong> {service.price} <br />
                      <strong>Rating:</strong> {service.rating} ⭐ <br />
                      {service.phone_number && (
                        <>
                          <strong>Phone:</strong>{" "}
                          <a href={`tel:${service.phone_number}`}>
                            {service.phone_number}
                          </a>{" "}
                          <br />
                        </>
                      )}
                      {distance && (
                        <>
                          <strong>Distance:</strong> {distance} km <br />
                        </>
                      )}
                      <button
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() => navigate(`/service/${service.id}`)}
                      >
                        Book Now
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

// Add PropTypes for MapComponent
MapComponent.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.string,
      rating: PropTypes.number,
      phone_number: PropTypes.string,
      lat: PropTypes.number,
      lon: PropTypes.number,
    })
  ).isRequired,
  userCoords: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }),
};

export default MapComponent;