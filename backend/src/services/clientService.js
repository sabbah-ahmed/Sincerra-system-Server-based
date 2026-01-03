const { v4: uuidv4 } = require('uuid');
const database = require('./simpleDatabase');

class ClientService {
  // Create new client
  async createClient(clientData) {
    return await database.createClient(clientData);
  }

  // Get all clients
  async getAllClients() {
    return await database.getAllClients();
  }

  // Get client by ID
  async getClientById(clientId) {
    return await database.getClientById(clientId);
  }

  // Update client
  async updateClient(clientId, updateData) {
    return await database.updateClient(clientId, updateData);
  }

  // Delete client
  async deleteClient(clientId) {
    const result = await database.deleteClient(clientId);
    return result ? true : null;
  }

  // Get client interactions/history
  async getClientInteractions(clientId) {
    return await database.getClientInteractions(clientId);
  }

  // Log interaction
  async logInteraction(clientId, type, description, createdBy = 'system', metadata = {}) {
    return await database.logInteraction(clientId, type, description, createdBy, metadata);
  }

  // Search clients by criteria
  async searchClients(criteria) {
    return await database.searchClients(criteria);
  }

  // Get clients due for contact
  async getClientsDueForContact() {
    return await database.getClientsDueForContact();
  }
}

module.exports = new ClientService();
