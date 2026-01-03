import React, { useState } from 'react';

function ClientForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyInterest: '',
    budgetRange: '',
    source: 'manual_entry',
    notes: ''
  });

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
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      propertyInterest: '',
      budgetRange: '',
      source: 'manual_entry',
      notes: ''
    });
  };

  return (
    <div className="form-section">
      <h2>Add New Client (Sales Dashboard)</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Client Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter client full name"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="client@example.com"
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+201234567890"
          />
        </div>

        <div className="form-group">
          <label>Property Interest</label>
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
            <option value="">Select budget range</option>
            <option value="0-500000">Under 500K EGP</option>
            <option value="500000-1000000">500K - 1M EGP</option>
            <option value="1000000-2000000">1M - 2M EGP</option>
            <option value="2000000-5000000">2M - 5M EGP</option>
            <option value="5000000+">Above 5M EGP</option>
          </select>
        </div>

        <div className="form-group">
          <label>Source</label>
          <select name="source" value={formData.source} onChange={handleChange}>
            <option value="manual_entry">Manual Entry</option>
            <option value="referral">Referral</option>
            <option value="social_media">Social Media</option>
            <option value="website">Website</option>
            <option value="walk_in">Walk-in</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Additional notes about the client..."
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Client</button>
        <button type="button" className="btn btn-secondary" onClick={() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            propertyInterest: '',
            budgetRange: '',
            source: 'manual_entry',
            notes: ''
          });
        }}>Clear Form</button>
      </form>
    </div>
  );
}

export default ClientForm;
