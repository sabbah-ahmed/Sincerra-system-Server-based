import React, { useState } from 'react';

function PublicForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyInterest: '',
    budgetRange: '',
    source: 'website_form',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      onSubmit({
        ...formData,
        notes: `Website inquiry: ${formData.message}`
      });
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          propertyInterest: '',
          budgetRange: '',
          source: 'website_form',
          message: ''
        });
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="form-section">
        <h2>Thank You!</h2>
        <div className="message success">
          <h3>Your inquiry has been submitted successfully!</h3>
          <p>We will contact you within 24 hours.</p>
          <p>You will receive a welcome email shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h2>Property Inquiry Form (Public)</h2>
      <p>Interested in our properties? Fill out this form and we'll get back to you!</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Email Address *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+201234567890"
          />
        </div>

        <div className="form-group">
          <label>Property Type of Interest</label>
          <select name="propertyInterest" value={formData.propertyInterest} onChange={handleChange}>
            <option value="">Select property type</option>
            <option value="1BR_APARTMENT">1 Bedroom Apartment</option>
            <option value="2BR_APARTMENT">2 Bedroom Apartment</option>
            <option value="3BR_APARTMENT">3 Bedroom Apartment</option>
            <option value="VILLA">Villa</option>
            <option value="STUDIO">Studio</option>
            <option value="COMMERCIAL">Commercial Property</option>
          </select>
        </div>

        <div className="form-group">
          <label>Budget Range</label>
          <select name="budgetRange" value={formData.budgetRange} onChange={handleChange}>
            <option value="">Select your budget</option>
            <option value="0-500000">Under 500K EGP</option>
            <option value="500000-1000000">500K - 1M EGP</option>
            <option value="1000000-2000000">1M - 2M EGP</option>
            <option value="2000000-5000000">2M - 5M EGP</option>
            <option value="5000000+">Above 5M EGP</option>
          </select>
        </div>

        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            placeholder="Tell us more about what you're looking for..."
          />
        </div>

        <button type="submit" className="btn btn-success">Submit Inquiry</button>
        <button type="button" className="btn btn-secondary" onClick={() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            propertyInterest: '',
            budgetRange: '',
            source: 'website_form',
            message: ''
          });
        }}>Clear Form</button>
      </form>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', border: '1px solid #bee5eb', borderRadius: '4px' }}>
        <h4>What happens next?</h4>
        <ul>
          <li>✅ You'll receive a welcome email immediately</li>
          <li>📞 Our sales team will contact you within 24 hours</li>
          <li>📋 We'll send you property options matching your criteria</li>
          <li>📅 We'll schedule follow-ups based on your preferences</li>
        </ul>
      </div>
    </div>
  );
}

export default PublicForm;
