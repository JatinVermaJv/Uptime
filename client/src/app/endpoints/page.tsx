'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import EndpointForm from '@/components/ui/EndpointForm';
import EndpointCard from '@/components/ui/EndpointCard';
import { Endpoint, ApiResponse } from '@/types';
import { endpoints } from '@/services/api';
import { handleApiError } from '@/services/api';

export default function EndpointsPage() {
  const [endpointsList, setEndpointsList] = useState<Endpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchEndpoints = async () => {
    try {
      const response = await endpoints.getAll() as ApiResponse<Endpoint[]>;
      setEndpointsList(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch endpoints:', err);
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const handleAddEndpoint = async (data: Partial<Endpoint>) => {
    try {
      // Ensure required fields are present
      if (!data.name || !data.url || !data.interval) {
        throw new Error('Name, URL, and interval are required');
      }
      
      const response = await endpoints.create({
        name: data.name,
        url: data.url,
        interval: data.interval
      }) as ApiResponse<Endpoint>;
      setEndpointsList([...endpointsList, response.data]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Failed to add endpoint:', err);
      setError(handleApiError(err));
    }
  };

  const handleEditEndpoint = async (data: Partial<Endpoint>) => {
    if (!editingEndpoint) return;

    try {
      const response = await endpoints.update(editingEndpoint.id, data) as ApiResponse<Endpoint>;
      setEndpointsList(endpointsList.map(e => e.id === editingEndpoint.id ? response.data : e));
      setEditingEndpoint(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Failed to update endpoint:', err);
      setError(handleApiError(err));
    }
  };

  const handleDeleteEndpoint = async (endpointId: string) => {
    try {
      await endpoints.delete(endpointId);
      setEndpointsList(endpointsList.filter(e => e.id !== endpointId));
      setError(null);
    } catch (err) {
      console.error('Failed to delete endpoint:', err);
      setError(handleApiError(err));
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Endpoints</h1>
          <button
            onClick={() => {
              setEditingEndpoint(null);
              setShowForm(true);
            }}
            className="btn-primary"
          >
            Add Endpoint
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-white px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card">
            <EndpointForm
              initialData={editingEndpoint || undefined}
              onSubmit={editingEndpoint ? handleEditEndpoint : handleAddEndpoint}
              onCancel={() => {
                setShowForm(false);
                setEditingEndpoint(null);
              }}
            />
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
                onEdit={() => {
                  setEditingEndpoint(endpoint);
                  setShowForm(true);
                }}
                onDelete={() => handleDeleteEndpoint(endpoint.id)}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
} 