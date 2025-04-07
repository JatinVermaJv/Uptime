'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import EndpointCard from '@/components/ui/EndpointCard';
import { Endpoint, ApiResponse, PingLog } from '@/types';
import { endpoints } from '@/services/api';
import { handleApiError } from '@/services/api';

export default function DashboardPage() {
  const [endpointsList, setEndpointsList] = useState<Endpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to determine endpoint status from its latest ping log
  const getEndpointStatus = (endpoint: Endpoint): 'up' | 'down' | 'unknown' => {
    if (!endpoint.pingLogs || endpoint.pingLogs.length === 0) {
      return 'unknown';
    }
    const latestPing = endpoint.pingLogs[0];
    return latestPing.success ? 'up' : 'down';
  };

  const fetchEndpoints = async () => {
    try {
      const response = await endpoints.getAll() as ApiResponse<Endpoint[]>;
      // Update endpoints with their current status based on ping logs
      const updatedEndpoints = response.data.map(endpoint => ({
        ...endpoint,
        status: getEndpointStatus(endpoint),
        lastChecked: endpoint.pingLogs?.[0]?.createdAt
      }));
      setEndpointsList(updatedEndpoints);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch endpoints:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch endpoints initially and then every 30 seconds
  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(fetchEndpoints, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleEdit = async (endpointId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit endpoint:', endpointId);
  };

  const handleDelete = async (endpointId: string) => {
    try {
      setError(null); // Clear any existing errors
      setIsLoading(true); // Show loading state
      
      await endpoints.delete(endpointId);
      
      // Remove the deleted endpoint from the list immediately
      setEndpointsList(current => current.filter(e => e.id !== endpointId));
      
    } catch (err) {
      console.error('Failed to delete endpoint:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    total: endpointsList.length,
    up: endpointsList.filter(e => e.status === 'up').length,
    down: endpointsList.filter(e => e.status === 'down').length,
    unknown: endpointsList.filter(e => e.status === 'unknown').length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-400">Total Endpoints</h3>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-400">Up</h3>
            <p className="text-3xl font-bold text-green-400">{stats.up}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-400">Down</h3>
            <p className="text-3xl font-bold text-red-400">{stats.down}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-400">Unknown</h3>
            <p className="text-3xl font-bold text-yellow-400">{stats.unknown}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-white px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Endpoints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-400">
              Loading endpoints...
            </div>
          ) : endpointsList.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">
              No endpoints found. Add your first endpoint to start monitoring.
            </div>
          ) : (
            endpointsList.map((endpoint) => (
              <EndpointCard
                key={endpoint.id}
                endpoint={endpoint}
                onEdit={() => handleEdit(endpoint.id)}
                onDelete={() => handleDelete(endpoint.id)}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
} 