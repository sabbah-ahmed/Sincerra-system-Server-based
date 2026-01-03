import React from 'react';

function Analytics({ clients }) {
  // Calculate statistics
  const totalClients = clients.length;
  const statusCounts = clients.reduce((acc, client) => {
    acc[client.status] = (acc[client.status] || 0) + 1;
    return acc;
  }, {});

  const sourceCounts = clients.reduce((acc, client) => {
    acc[client.source] = (acc[client.source] || 0) + 1;
    return acc;
  }, {});

  const todayClients = clients.filter(client => {
    const today = new Date().toDateString();
    const clientDate = new Date(client.createdAt).toDateString();
    return today === clientDate;
  }).length;

  const thisWeekClients = clients.filter(client => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(client.createdAt) >= oneWeekAgo;
  }).length;

  if (totalClients === 0) {
    return (
      <div className="form-section">
        <h2>Analytics Dashboard</h2>
        <p>No data available yet. Add some clients to see analytics.</p>
      </div>
    );
  }

  return (
    <div className="form-section">
      <h2>Analytics Dashboard</h2>
      
      {/* Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', border: '1px solid #90caf9', borderRadius: '4px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#1565c0' }}>{totalClients}</h3>
          <p style={{ margin: 0, color: '#666' }}>Total Clients</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', border: '1px solid #ce93d8', borderRadius: '4px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#7b1fa2' }}>{todayClients}</h3>
          <p style={{ margin: 0, color: '#666' }}>Added Today</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#e8f5e8', border: '1px solid #a5d6a7', borderRadius: '4px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#2e7d32' }}>{thisWeekClients}</h3>
          <p style={{ margin: 0, color: '#666' }}>This Week</p>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#fff3e0', border: '1px solid #ffcc02', borderRadius: '4px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 5px 0', color: '#f57c00' }}>
            {totalClients > 0 ? Math.round((statusCounts.ACTIVE || 0) / totalClients * 100) : 0}%
          </h3>
          <p style={{ margin: 0, color: '#666' }}>Conversion Rate</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Client Status Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center' }}>
              <div className={`status-badge status-${status.toLowerCase()}`} style={{ display: 'block', marginBottom: '5px' }}>
                {status}
              </div>
              <strong>{count} clients</strong>
              <br />
              <small>{Math.round(count / totalClients * 100)}%</small>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Sources */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Lead Sources</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
          {Object.entries(sourceCounts).map(([source, count]) => (
            <div key={source} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <strong>{source.replace('_', ' ').toUpperCase()}</strong>
              <br />
              <span>{count} clients ({Math.round(count / totalClients * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3>Recent Clients (Last 5)</h3>
        <div>
          {clients
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(client => (
              <div key={client.id} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{client.name}</strong>
                  <br />
                  <small>{client.email} | {new Date(client.createdAt).toLocaleDateString()}</small>
                </div>
                <span className={`status-badge status-${client.status.toLowerCase()}`}>
                  {client.status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button 
          className="btn btn-primary"
          onClick={() => alert('Exporting client data...')}
        >
          Export Data (CSV)
        </button>
        <button 
          className="btn btn-success"
          onClick={() => alert('Sending bulk email...')}
        >
          Send Bulk Email
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => alert('Generating detailed report...')}
        >
          Generate Report
        </button>
      </div>
    </div>
  );
}

export default Analytics;
