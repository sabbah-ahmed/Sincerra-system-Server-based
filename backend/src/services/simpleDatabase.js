const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SimpleDatabase {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data');
    this.clientsFile = path.join(this.dataDir, 'clients.json');
    this.interactionsFile = path.join(this.dataDir, 'interactions.json');
    
    // Create data directory if it doesn't exist
    this.ensureDataDirectory();
    this.initializeFiles();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      console.log('✅ Created data directory:', this.dataDir);
    }
  }

  initializeFiles() {
    // Initialize clients file
    if (!fs.existsSync(this.clientsFile)) {
      this.writeFile(this.clientsFile, []);
      console.log('✅ Initialized clients.json');
    }
    
    // Initialize interactions file
    if (!fs.existsSync(this.interactionsFile)) {
      this.writeFile(this.interactionsFile, []);
      console.log('✅ Initialized interactions.json');
    }
  }

  readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  writeFile(filePath, data) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing file:', error);
      return false;
    }
  }

  // Client operations
  async getAllClients() {
    return this.readFile(this.clientsFile);
  }

  async getClientById(clientId) {
    const clients = this.readFile(this.clientsFile);
    return clients.find(client => client.id === clientId) || null;
  }

  async createClient(clientData) {
    const clients = this.readFile(this.clientsFile);
    
    // Check for duplicate email
    const existingClient = clients.find(client => client.email === clientData.email);
    if (existingClient) {
      throw new Error('Client with this email already exists');
    }

    const newClient = {
      id: uuidv4(),
      ...clientData,
      status: clientData.status || 'LEAD',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_contact: null,
      next_contact: this.calculateNextContact(clientData.status || 'LEAD'),
      assigned_to: null
    };

    clients.push(newClient);
    
    if (this.writeFile(this.clientsFile, clients)) {
      // Log the creation
      await this.logInteraction(newClient.id, 'CLIENT_CREATED', 'Client created in system', 'system');
      return newClient;
    } else {
      throw new Error('Failed to save client');
    }
  }

  async updateClient(clientId, updateData) {
    const clients = this.readFile(this.clientsFile);
    const clientIndex = clients.findIndex(client => client.id === clientId);
    
    if (clientIndex === -1) {
      return null;
    }

    // Update the client
    const updatedClient = {
      ...clients[clientIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    // If status is being updated, recalculate next contact date
    if (updateData.status) {
      updatedClient.next_contact = this.calculateNextContact(updateData.status);
    }

    clients[clientIndex] = updatedClient;
    
    if (this.writeFile(this.clientsFile, clients)) {
      // Log the update
      await this.logInteraction(
        clientId,
        'CLIENT_UPDATED',
        `Client information updated: ${Object.keys(updateData).join(', ')}`,
        'system'
      );
      return updatedClient;
    } else {
      throw new Error('Failed to update client');
    }
  }

  async deleteClient(clientId) {
    const clients = this.readFile(this.clientsFile);
    const clientIndex = clients.findIndex(client => client.id === clientId);
    
    if (clientIndex === -1) {
      return false;
    }

    // Log deletion before removing
    await this.logInteraction(
      clientId,
      'CLIENT_DELETED',
      'Client record deleted from system',
      'system'
    );

    clients.splice(clientIndex, 1);
    return this.writeFile(this.clientsFile, clients);
  }

  async searchClients(criteria) {
    const clients = this.readFile(this.clientsFile);
    
    return clients.filter(client => {
      if (criteria.status && client.status !== criteria.status) return false;
      if (criteria.name && !client.name.toLowerCase().includes(criteria.name.toLowerCase())) return false;
      if (criteria.email && !client.email.toLowerCase().includes(criteria.email.toLowerCase())) return false;
      return true;
    });
  }

  // Interaction operations
  async getClientInteractions(clientId) {
    const interactions = this.readFile(this.interactionsFile);
    return interactions
      .filter(interaction => interaction.client_id === clientId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async logInteraction(clientId, type, description, createdBy = 'system', metadata = {}) {
    const interactions = this.readFile(this.interactionsFile);
    
    const interaction = {
      id: uuidv4(),
      client_id: clientId,
      type,
      description,
      created_by: createdBy,
      created_at: new Date().toISOString(),
      metadata
    };

    interactions.push(interaction);
    
    if (this.writeFile(this.interactionsFile, interactions)) {
      return interaction;
    } else {
      throw new Error('Failed to log interaction');
    }
  }

  // Utility methods
  calculateNextContact(status) {
    const now = new Date();
    
    switch (status) {
      case 'LEAD':
        now.setDate(now.getDate() + 3); // Contact in 3 days
        break;
      case 'PROSPECT':
        now.setDate(now.getDate() + 7); // Contact in 1 week
        break;
      case 'ACTIVE':
        now.setDate(now.getDate() + 14); // Contact in 2 weeks
        break;
      case 'CLOSED':
        return null; // No follow-up needed
      default:
        now.setDate(now.getDate() + 7); // Default: 1 week
    }
    
    return now.toISOString();
  }

  async getClientsDueForContact() {
    const clients = this.readFile(this.clientsFile);
    const now = new Date();
    
    return clients.filter(client => {
      if (!client.next_contact) return false;
      return new Date(client.next_contact) <= now;
    });
  }

  // Test connection
  async testConnection() {
    try {
      // Test read/write operations
      const testData = { test: true, timestamp: new Date().toISOString() };
      const testFile = path.join(this.dataDir, 'test.json');
      
      // Write test
      fs.writeFileSync(testFile, JSON.stringify(testData));
      
      // Read test
      const readData = JSON.parse(fs.readFileSync(testFile, 'utf8'));
      
      // Cleanup
      fs.unlinkSync(testFile);
      
      console.log('✅ Database connection test successful');
      console.log('📁 Data directory:', this.dataDir);
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error.message);
      return false;
    }
  }
}

module.exports = new SimpleDatabase();
