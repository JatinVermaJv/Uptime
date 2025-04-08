'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import EndpointCard from '@/components/ui/EndpointCard';
import { Endpoint, ApiResponse } from '@/types';
import { endpoints, handleApiError } from '@/services/api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, CheckCircle2, XCircle, ArrowUp, ArrowDown, Clock } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [endpointsList, setEndpointsList] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to determine endpoint status from its latest ping log
  const getEndpointStatus = (endpoint: Endpoint): 'up' | 'down' | 'unknown' => {
    if (!endpoint.pingLogs || endpoint.pingLogs.length === 0) {
      return 'unknown';
    }
    const latestPing = endpoint.pingLogs[0];
    return latestPing.success ? 'up' : 'down';
  };

  const fetchEndpoints = useCallback(async () => {
    try {
      setLoading(true);
      const response = await endpoints.getAll();
      const data = (response as ApiResponse<Endpoint[]>).data;
      // Update endpoints with their current status based on ping logs
      const updatedEndpoints = data.map(endpoint => ({
        ...endpoint,
        status: getEndpointStatus(endpoint),
        lastChecked: endpoint.pingLogs?.[0]?.createdAt
      }));
      setEndpointsList(updatedEndpoints);
      setError(null);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEndpoints();
    const interval = setInterval(fetchEndpoints, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchEndpoints]);

  const handleEdit = (endpoint: Endpoint) => {
    router.push(`/endpoints/${endpoint.id}`);
  };

  const handleDelete = async (endpointId: string) => {
    try {
      await endpoints.delete(endpointId);
      toast.success('Endpoint deleted successfully');
      fetchEndpoints();
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast.error(errorMessage);
    }
  };

  const handleAdd = () => {
    router.push('/endpoints/new');
  };

  // Calculate statistics
  const totalEndpoints = endpointsList.length;
  const upEndpoints = endpointsList.filter(e => e.status === 'up').length;
  const downEndpoints = endpointsList.filter(e => e.status === 'down').length;
  const uptimePercentage = totalEndpoints > 0 ? (upEndpoints / totalEndpoints) * 100 : 0;

  const stats = {
    total: totalEndpoints,
    up: upEndpoints,
    down: downEndpoints,
    uptime: uptimePercentage.toFixed(2),
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Add Endpoint
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Up</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.up}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Down</CardTitle>
              <ArrowDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.down}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uptime}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 text-white px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        {/* Endpoints Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Endpoints</h2>
          {endpointsList.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No endpoints found. Add your first endpoint to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {endpointsList.map((endpoint) => (
                <Card key={endpoint.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{endpoint.name}</span>
                      <span className={`text-sm font-medium ${
                        endpoint.status === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {endpoint.status}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">{endpoint.url}</p>
                      <p className="text-sm text-muted-foreground">
                        Last checked: {endpoint.lastChecked ? new Date(endpoint.lastChecked).toLocaleString() : 'Never'}
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(endpoint)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(endpoint.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 