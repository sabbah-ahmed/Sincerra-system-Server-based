const clientService = require('../services/clientService');
const responses = require('../utils/responses');

const clientController = {
  // GET /api/clients - Get all clients
  async getAllClients(req, res) {
    try {
      const { status, name, email } = req.query;
      let clients;
      
      // If search criteria provided, use search function
      if (status || name || email) {
        clients = await clientService.searchClients({ status, name, email });
      } else {
        clients = await clientService.getAllClients();
      }
      
      responses.success(res, clients, `Found ${clients.length} clients`);
    } catch (error) {
      console.error('Get all clients error:', error);
      responses.internalError(res, 'Failed to retrieve clients');
    }
  },

  // GET /api/clients/:id - Get single client
  async getClientById(req, res) {
    try {
      const { id } = req.params;
      const client = await clientService.getClientById(id);
      
      if (!client) {
        return responses.notFound(res, 'Client not found');
      }
      
      responses.success(res, client);
    } catch (error) {
      console.error('Get client by ID error:', error);
      responses.internalError(res, 'Failed to retrieve client');
    }
  },

  // POST /api/clients - Create new client
  async createClient(req, res) {
    try {
      const client = await clientService.createClient(req.body);
      responses.created(res, client, 'Client created successfully');
    } catch (error) {
      console.error('Create client error:', error);
      
      // Handle duplicate email error
      if (error.code === 'ConditionalCheckFailedException') {
        return responses.conflict(res, 'A client with this email already exists');
      }
      
      responses.internalError(res, 'Failed to create client');
    }
  },

  // PUT /api/clients/:id - Update client
  async updateClient(req, res) {
    try {
      const { id } = req.params;
      
      // Check if client exists
      const existingClient = await clientService.getClientById(id);
      if (!existingClient) {
        return responses.notFound(res, 'Client not found');
      }
      
      const updatedClient = await clientService.updateClient(id, req.body);
      responses.success(res, updatedClient, 'Client updated successfully');
    } catch (error) {
      console.error('Update client error:', error);
      responses.internalError(res, 'Failed to update client');
    }
  },

  // DELETE /api/clients/:id - Delete client
  async deleteClient(req, res) {
    try {
      const { id } = req.params;
      
      const result = await clientService.deleteClient(id);
      if (!result) {
        return responses.notFound(res, 'Client not found');
      }
      
      responses.success(res, null, 'Client deleted successfully');
    } catch (error) {
      console.error('Delete client error:', error);
      responses.internalError(res, 'Failed to delete client');
    }
  },

  // GET /api/clients/:id/interactions - Get client interactions
  async getClientInteractions(req, res) {
    try {
      const { id } = req.params;
      
      // Check if client exists
      const client = await clientService.getClientById(id);
      if (!client) {
        return responses.notFound(res, 'Client not found');
      }
      
      const interactions = await clientService.getClientInteractions(id);
      responses.success(res, interactions, `Found ${interactions.length} interactions`);
    } catch (error) {
      console.error('Get client interactions error:', error);
      responses.internalError(res, 'Failed to retrieve client interactions');
    }
  },

  // PUT /api/clients/:id/status - Update client status
  async updateClientStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      
      // Validate status
      const validStatuses = ['LEAD', 'PROSPECT', 'ACTIVE', 'CLOSED'];
      if (!validStatuses.includes(status)) {
        return responses.badRequest(res, 'Invalid status. Must be one of: ' + validStatuses.join(', '));
      }
      
      // Check if client exists
      const existingClient = await clientService.getClientById(id);
      if (!existingClient) {
        return responses.notFound(res, 'Client not found');
      }
      
      const updateData = { status };
      if (notes) updateData.notes = notes;
      
      const updatedClient = await clientService.updateClient(id, updateData);
      
      // Log status change
      await clientService.logInteraction(
        `CLIENT#${id}`,
        'STATUS_CHANGED',
        `Status changed from ${existingClient.status} to ${status}`,
        'system'
      );
      
      responses.success(res, updatedClient, `Client status updated to ${status}`);
    } catch (error) {
      console.error('Update client status error:', error);
      responses.internalError(res, 'Failed to update client status');
    }
  },

  // GET /api/clients/due-for-contact - Get clients due for contact
  async getClientsDueForContact(req, res) {
    try {
      const clients = await clientService.getClientsDueForContact();
      responses.success(res, clients, `Found ${clients.length} clients due for contact`);
    } catch (error) {
      console.error('Get clients due for contact error:', error);
      responses.internalError(res, 'Failed to retrieve clients due for contact');
    }
  }
};

module.exports = clientController;
