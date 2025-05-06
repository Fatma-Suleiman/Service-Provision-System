import React from "react";

const AboutScreen = () => {
  return (
    <div className="container my-5">
      {/* Hero Image Section */}
      <div className="text-center mb-4">
        <img 
          src="/images/workers.webp"  
          alt="About JiraniConnect" 
          className="img-fluid rounded-circle shadow-lg d-block mx-auto"
  
          style={{ width: "350px", height: "350px", objectFit: "cover", border: "5px solid burlywood" }} 
        />
      </div>

      {/* About Title */}
      <h1 className="text-center my-4" style={{ fontFamily: "'Montserrat', sans-serif", color: "#2c3e50", fontWeight: "600", fontSize: "36px" }}>
        About JiraniConnect
      </h1>

      {/* Lead Text */}
      <p className="lead text-center" style={{ fontSize: "20px", fontStyle: "italic", color: "#34495e", maxWidth: "800px", margin: "0 auto" }}>
        JiraniConnect is a platform that connects people with trusted local service providers, 
        making it easier to find skilled professionals for everyday needs.
      </p>

      {/* Mission and Vision Section */}
      <div className="row mt-5 align-items-center">
        <div className="col-md-6 mb-4">
          <h2 className="text-center" style={{ fontFamily: "'Poppins', sans-serif", color: "#27ae60", fontWeight: "600" }}>Our Mission</h2>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#2c3e50", textAlign: "justify" }}>
            Our mission is to bridge the gap between service seekers and skilled professionals 
            by providing a seamless, reliable, and secure platform.
          </p>
        </div>

        <div className="col-md-6 mb-4">
          <h2 className="text-center" style={{ fontFamily: "'Poppins', sans-serif", color: "#e74c3c", fontWeight: "600" }}>Our Vision</h2>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#2c3e50", textAlign: "justify" }}>
            To be the go-to platform for accessing quality and affordable services within 
            local communities, while empowering service providers with new opportunities.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="container my-5">
        <h2 className="mb-4 text-center" style={{ fontFamily: "'Montserrat', sans-serif", color: "#8e44ad", fontWeight: "600" }}>Why Choose JiraniConnect?</h2>
        <div className="row">
          {[
            { title: '🌟 Trusted Providers', text: 'We carefully verify all service providers to ensure they meet high standards.' },
            { title: '💰 Affordable Pricing', text: 'Get competitive pricing for top-quality services without hidden costs.' },
            { title: '🚀 Fast & Reliable', text: 'Book services instantly and get quick responses from nearby providers.' }
          ].map((item, index) => (
            <div key={index} className="col-md-4">
              <div 
                className="card h-100 shadow-lg"
                style={{
                  transition: "transform 0.3s ease-in-out",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <div className="mt-5">
        <h2 className="text-center" style={{ fontFamily: "'Lato', sans-serif", color: "#8e44ad", fontWeight: "600" }}>How It Works</h2>
        <ul className="list-group list-group-flush">
          {[
            { icon: '🔍', text: 'Browse and discover services near you.' },
            { icon: '📞', text: 'Contact a provider directly or book through the platform.' },
            { icon: '💬', text: 'Rate and review services to help others make informed choices.' }
          ].map((item, index) => (
            <li key={index} 
              className="list-group-item" 
              style={{
                fontSize: "16px", 
                color: "#2c3e50", 
                border: "none", 
                padding: "15px", 
                backgroundColor: "#f9f9f9",
                transition: "background-color 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f1f1'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
            >
              <span style={{ fontSize: "22px" }}>{item.icon}</span> {item.text}
            </li>
          ))}
        </ul>
      </div>

      
    </div>
  );
};

export default AboutScreen;