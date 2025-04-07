const cron = require('node-cron');
const axios = require('axios');
const prisma = require('../db');

class Scheduler {
  constructor() {
    this.jobs = new Map(); // Store cron jobs
  }

  async start() {
    console.log('Starting scheduler...');
    
    // Schedule a job to check for new endpoints every minute
    cron.schedule('* * * * *', async () => {
      await this.updateJobs();
    });

    // Initial setup
    await this.updateJobs();
  }

  async updateJobs() {
    try {
      // Get all active endpoints
      const endpoints = await prisma.endpoint.findMany({
        where: {
          isActive: true
        }
      });

      // Create a Set of current endpoint IDs
      const currentEndpointIds = new Set(endpoints.map(ep => ep.id));

      // Remove jobs for endpoints that no longer exist or are inactive
      for (const [endpointId, job] of this.jobs.entries()) {
        if (!currentEndpointIds.has(endpointId)) {
          job.stop();
          this.jobs.delete(endpointId);
        }
      }

      // Add or update jobs for active endpoints
      for (const endpoint of endpoints) {
        if (!this.jobs.has(endpoint.id)) {
          this.scheduleEndpoint(endpoint);
        }
      }
    } catch (error) {
      console.error('Error updating jobs:', error);
    }
  }

  scheduleEndpoint(endpoint) {
    // Convert minutes to cron expression
    const cronExpression = `*/${endpoint.interval} * * * *`;
    
    // Create new job
    const job = cron.schedule(cronExpression, async () => {
      try {
        await this.pingEndpoint(endpoint);
      } catch (error) {
        console.error(`Error pinging endpoint ${endpoint.id}:`, error);
      }
    });

    // Store the job
    this.jobs.set(endpoint.id, job);
    console.log(`Scheduled endpoint ${endpoint.id} (${endpoint.url}) to check every ${endpoint.interval} minutes`);
  }

  async pingEndpoint(endpoint) {
    const startTime = Date.now();
    let status = 0;
    let success = false;
    let error = null;

    try {
      const response = await axios.get(endpoint.url, {
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => true // Accept all status codes
      });

      status = response.status;
      success = status >= 200 && status < 300;
    } catch (err) {
      error = err.message;
      success = false;
    }

    const responseTime = Date.now() - startTime;

    // Create ping log
    await prisma.pingLog.create({
      data: {
        endpointId: endpoint.id,
        status,
        responseTime,
        success,
        error: error || null
      }
    });

    console.log(`Pinged ${endpoint.url}: ${success ? 'Yes' : 'No'} (${responseTime}ms)`);
  }

  stop() {
    // Stop all jobs
    for (const job of this.jobs.values()) {
      job.stop();
    }
    this.jobs.clear();
    console.log('Stopped scheduler');
  }
}

// Create and export singleton instance
const scheduler = new Scheduler();
module.exports = scheduler; 