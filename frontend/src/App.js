import React, { useState, useEffect } from 'react';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import PublicForm from './components/PublicForm';
import Analytics from './components/Analytics';

const API_BASE_URL = 'https://uzt1t3u3ff.execute-api.us-east-1.amazonaws.com/api';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [clients, setClients] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showMessage = (msg, type = 'success') => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3000);
  };

  // Fetch clients from backend
  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/clients`);
      const result = await response.json();
      
      if (result.success) {
        setClients(result.data || []);
      } else {
        showMessage('Failed to load clients', 'error');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      showMessage('Error connecting to server', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load clients when component mounts
  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = async (clientData) => {
    try {
      setLoading(true);
      // Transform frontend data to match backend schema
      const backendData = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        property_interest: clientData.propertyInterest?.replace(/\s+/g, '_').toUpperCase() || 'APARTMENT',
        budget_range: clientData.budgetRange || '0-500000',
        source: clientData.source || 'manual_entry',
        notes: clientData.notes || ''
      };

      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData)
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchClients(); // Reload clients
        showMessage('Client added successfully!');
      } else {
        showMessage(result.message || 'Failed to add client', 'error');
      }
    } catch (error) {
      console.error('Error adding client:', error);
      showMessage('Error adding client', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientId, newStatus) => {
    try {
      // For now, just show a message since we don't have status field in our backend
      showMessage(`Status update feature coming soon!`, 'info');
    } catch (error) {
      console.error('Error updating client:', error);
      showMessage('Error updating client', 'error');
    }
  };

  const deleteClient = async (clientId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchClients(); // Reload clients
        showMessage('Client deleted successfully!');
      } else {
        showMessage(result.message || 'Failed to delete client', 'error');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      showMessage('Error deleting client', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Real Estate CRM - Basic Testing Interface</h1>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="nav-buttons">
        <button 
          className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentView('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`btn ${currentView === 'add-client' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentView('add-client')}
        >
          Add Client
        </button>
        <button 
          className={`btn ${currentView === 'public-form' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentView('public-form')}
        >
          Public Form
        </button>
        <button 
          className={`btn ${currentView === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setCurrentView('analytics')}
        >
          Analytics
        </button>
      </div>

      {currentView === 'dashboard' && (
        <ClientList 
          clients={clients}
          onUpdateStatus={updateClientStatus}
          onDeleteClient={deleteClient}
          loading={loading}
        />
      )}

      {currentView === 'add-client' && (
        <ClientForm onSubmit={addClient} />
      )}

      {currentView === 'public-form' && (
        <PublicForm onSubmit={addClient} />
      )}

      {currentView === 'analytics' && (
        <Analytics clients={clients} />
      )}
    </div>
  );
}

export default App;
