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
    // Convert seconds to cron expression
    // If interval is less than 60 seconds, schedule it every X seconds
    // If interval is 60 seconds or more, convert to minutes
    let cronExpression;
    if (endpoint.interval < 60) {
      cronExpression = `*/${endpoint.interval} * * * * *`; // Include seconds
    } else {
      const minutes = Math.floor(endpoint.interval / 60);
      cronExpression = `*/${minutes} * * * *`;
    }
    
    // Create new job
    const job = cron.schedule(cronExpression, async () => {
      try {
        await this.pingEndpoint(endpoint);
      } catch (error) {
        console.error(`Error pinging endpoint ${endpoint.id}:`, error);
      }
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    // Store the job
    this.jobs.set(endpoint.id, job);
    const timeUnit = endpoint.interval < 60 ? 'seconds' : 'minutes';
    const timeValue = endpoint.interval < 60 ? endpoint.interval : Math.floor(endpoint.interval / 60);
    console.log(`Scheduled endpoint ${endpoint.id} (${endpoint.url}) to check every ${timeValue} ${timeUnit}`);
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
      status = 0; // Connection failed
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

    // More detailed logging
    const statusText = success ? 'UP' : 'DOWN';
    const errorText = error ? ` (Error: ${error})` : '';
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Endpoint "${endpoint.name}" (${endpoint.url}): ${statusText} - ${status} - ${responseTime}ms${errorText}`);
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