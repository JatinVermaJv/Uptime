'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { endpoints as endpointsApi, handleApiError } from '@/services/api';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon, Activity, Clock, Plus } from 'lucide-react';
import { Endpoint, ApiResponse } from '@/types';
import Navigation from '@/components/ui/Navigation';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const [endpointsList, setEndpointsList] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEndpoints = async () => {
    try {
      const response = await endpointsApi.getAll();
      const data = (response as ApiResponse<Endpoint[]>).data;
      setEndpointsList(data);
    } catch (error) {
      console.error('Error fetching endpoints:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  // Calculate statistics
  const totalEndpoints = endpointsList.length;
  const upEndpoints = endpointsList.filter(endpoint => endpoint.status === 'up').length;
  const downEndpoints = endpointsList.filter(endpoint => endpoint.status === 'down').length;
  const unknownEndpoints = endpointsList.filter(endpoint => endpoint.status === 'unknown').length;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="p-8">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Monitor your endpoints and track their status</p>
          </div>
          <Button onClick={() => router.push('/endpoints')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Endpoint
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Endpoints</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEndpoints}</div>
              <p className="text-xs text-muted-foreground">
                Total monitored endpoints
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Up</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{upEndpoints}</div>
              <p className="text-xs text-muted-foreground">
                Endpoints running normally
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Down</CardTitle>
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{downEndpoints}</div>
              <p className="text-xs text-muted-foreground">
                Endpoints experiencing issues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unknown</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{unknownEndpoints}</div>
              <p className="text-xs text-muted-foreground">
                Endpoints pending first check
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Status</h2>
            {endpointsList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No endpoints found</p>
                <Button onClick={() => router.push('/endpoints')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add your first endpoint
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {endpointsList.map((endpoint) => (
                  <Card key={endpoint.id} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => router.push(`/endpoints/${endpoint.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{endpoint.name}</h3>
                          <p className="text-sm text-muted-foreground">{endpoint.url}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm ${
                          endpoint.status === 'up' 
                            ? 'bg-green-500/10 text-green-500' 
                            : endpoint.status === 'down'
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {endpoint.status === 'up' ? 'Up' : endpoint.status === 'down' ? 'Down' : 'Unknown'}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Last checked: {endpoint.lastChecked ? new Date(endpoint.lastChecked).toLocaleString() : 'Never'}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 