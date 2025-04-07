const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all endpoints for the current user
router.get('/', async (req, res) => {
  try {
    const endpoints = await prisma.endpoint.findMany({
      where: {
        userId: req.user.id
      },
      include: {
        pingLogs: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1 // Get only the latest ping log
        }
      }
    });

    res.json(endpoints);
  } catch (error) {
    console.error('Error fetching endpoints:', error);
    res.status(500).json({ error: 'Error fetching endpoints' });
  }
});

// Get a single endpoint by ID
router.get('/:id', async (req, res) => {
  try {
    const endpoint = await prisma.endpoint.findFirst({
      where: {
        id: parseInt(req.params.id),
        userId: req.user.id
      },
      include: {
        pingLogs: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10 // Get last 10 ping logs
        }
      }
    });

    if (!endpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    res.json(endpoint);
  } catch (error) {
    console.error('Error fetching endpoint:', error);
    res.status(500).json({ error: 'Error fetching endpoint' });
  }
});

// Create a new endpoint
router.post('/', async (req, res) => {
  try {
    const { url, name, interval } = req.body;

    // Validate input
    if (!url || !name) {
      return res.status(400).json({ error: 'URL and name are required' });
    }

    const endpoint = await prisma.endpoint.create({
      data: {
        url,
        name,
        interval: interval || 5, // Default to 5 minutes if not specified
        userId: req.user.id
      }
    });

    res.status(201).json(endpoint);
  } catch (error) {
    console.error('Error creating endpoint:', error);
    res.status(500).json({ error: 'Error creating endpoint' });
  }
});

// Update an endpoint
router.put('/:id', async (req, res) => {
  try {
    const { url, name, interval, isActive } = req.body;
    const endpointId = parseInt(req.params.id);

    // Check if endpoint exists and belongs to user
    const existingEndpoint = await prisma.endpoint.findFirst({
      where: {
        id: endpointId,
        userId: req.user.id
      }
    });

    if (!existingEndpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    const updatedEndpoint = await prisma.endpoint.update({
      where: {
        id: endpointId
      },
      data: {
        url: url || existingEndpoint.url,
        name: name || existingEndpoint.name,
        interval: interval || existingEndpoint.interval,
        isActive: isActive !== undefined ? isActive : existingEndpoint.isActive
      }
    });

    res.json(updatedEndpoint);
  } catch (error) {
    console.error('Error updating endpoint:', error);
    res.status(500).json({ error: 'Error updating endpoint' });
  }
});

// Delete an endpoint
router.delete('/:id', async (req, res) => {
  try {
    const endpointId = parseInt(req.params.id);

    // Check if endpoint exists and belongs to user
    const existingEndpoint = await prisma.endpoint.findFirst({
      where: {
        id: endpointId,
        userId: req.user.id
      }
    });

    if (!existingEndpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    await prisma.endpoint.delete({
      where: {
        id: endpointId
      }
    });

    res.json({ message: 'Endpoint deleted successfully' });
  } catch (error) {
    console.error('Error deleting endpoint:', error);
    res.status(500).json({ error: 'Error deleting endpoint' });
  }
});

// Trigger a manual ping for an endpoint
router.post('/:id/ping', async (req, res) => {
  try {
    const endpointId = parseInt(req.params.id);

    // Check if endpoint exists and belongs to user
    const endpoint = await prisma.endpoint.findFirst({
      where: {
        id: endpointId,
        userId: req.user.id
      }
    });

    if (!endpoint) {
      return res.status(404).json({ error: 'Endpoint not found' });
    }

    // TODO: Implement actual ping logic here
    // For now, we'll just create a mock ping log
    const pingLog = await prisma.pingLog.create({
      data: {
        endpointId,
        status: 200,
        responseTime: 150,
        success: true
      }
    });

    res.json(pingLog);
  } catch (error) {
    console.error('Error pinging endpoint:', error);
    res.status(500).json({ error: 'Error pinging endpoint' });
  }
});

module.exports = router; 