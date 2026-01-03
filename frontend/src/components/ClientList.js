import React from 'react';

function ClientList({ clients, onUpdateStatus, onDeleteClient, loading }) {
  const getStatusClass = (status) => {
    return `status-badge status-${status?.toLowerCase() || 'lead'}`;
  };

  const handleStatusChange = (clientId, currentStatus) => {
    const statusOptions = ['LEAD', 'PROSPECT', 'ACTIVE', 'CLOSED'];
    const currentIndex = statusOptions.indexOf(currentStatus || 'LEAD');
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    onUpdateStatus(clientId, statusOptions[nextIndex]);
  };

  const formatPropertyInterest = (interest) => {
    if (!interest) return 'Not specified';
    return interest.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatBudgetRange = (range) => {
    if (!range) return 'Not specified';
    const [min, max] = range.split('-');
    return `$${parseInt(min).toLocaleString()} - $${parseInt(max).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="form-section">
        <h2>Client Dashboard</h2>
        <p>Loading clients...</p>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="form-section">
        <h2>Client Dashboard</h2>
        <p>No clients added yet. Use the "Add Client" tab to add your first client.</p>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h2>Client Dashboard ({clients.length} clients)</h2>
      
      <div className="client-list">
        {clients.map(client => (
          <div key={client.id} className="client-item">
            <h4>{client.name}</h4>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Property Interest:</strong> {formatPropertyInterest(client.property_interest)}</p>
            <p><strong>Budget:</strong> {formatBudgetRange(client.budget_range)}</p>
            <p><strong>Source:</strong> {client.source || 'manual_entry'}</p>
            <p><strong>Status:</strong> <span className={getStatusClass(client.status)}>LEAD</span></p>
            <p><strong>Added:</strong> {new Date(client.created_at || client.createdAt).toLocaleDateString()}</p>
            {client.notes && <p><strong>Notes:</strong> {client.notes}</p>}
            
            <div style={{ marginTop: '10px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => handleStatusChange(client.id, client.status)}
              >
                Update Status
              </button>
              <button 

                className="btn btn-danger"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete ${client.name}?`)) {
                    onDeleteClient(client.id);
                  }
                }}
                style={{ marginLeft: '10px' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientList;
