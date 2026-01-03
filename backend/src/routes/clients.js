const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validateMiddleware, clientValidation } = require('../utils/validators');

// GET /api/clients - Get all clients (with optional search)
router.get('/', clientController.getAllClients);

// GET /api/clients/due-for-contact - Get clients due for contact
router.get('/due-for-contact', clientController.getClientsDueForContact);

// GET /api/clients/:id - Get single client
router.get('/:id', clientController.getClientById);

// POST /api/clients - Create new client
router.post('/', 
  validateMiddleware(clientValidation.create),
  clientController.createClient
);

// PUT /api/clients/:id - Update client
router.put('/:id',
  validateMiddleware(clientValidation.update),
  clientController.updateClient
);

// DELETE /api/clients/:id - Delete client
router.delete('/:id', clientController.deleteClient);

// GET /api/clients/:id/interactions - Get client interaction history
router.get('/:id/interactions', clientController.getClientInteractions);

// PUT /api/clients/:id/status - Update client status
router.put('/:id/status', clientController.updateClientStatus);

module.exports = router;
