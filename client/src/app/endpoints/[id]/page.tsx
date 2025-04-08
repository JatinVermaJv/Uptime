'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { endpoints as endpointsApi, handleApiError } from '@/services/api';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Endpoint, ApiResponse, PingLog } from '@/types';

export default function EndpointDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEndpoint = async () => {
    try {
      const response = await endpointsApi.getOne(params.id as string);
      const data = (response as ApiResponse<Endpoint>).data;
      setEndpoint(data);
    } catch (error) {
      console.error('Error fetching endpoint:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoint();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this endpoint?')) return;
    
    try {
      await endpointsApi.delete(params.id as string);
      toast.success('Endpoint deleted successfully');
      router.push('/endpoints');
    } catch (error) {
      console.error('Error deleting endpoint:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-400">Endpoint not found</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{endpoint.name}</h1>
        <div className="flex space-x-2 ml-auto">
          <Button variant="outline" onClick={() => router.push(`/endpoints/${endpoint.id}/edit`)}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Endpoint Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-400">URL</p>
              <p className="text-white">{endpoint.url}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Check Interval</p>
              <p className="text-white">{(endpoint.interval / 60).toFixed(2)} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className={`${
                endpoint.status === 'up' ? 'text-green-500' : 
                endpoint.status === 'down' ? 'text-red-500' : 
                'text-yellow-500'
              }`}>
                {endpoint.status || 'Unknown'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Last Checked</p>
              <p className="text-white">
                {endpoint.lastChecked ? new Date(endpoint.lastChecked).toLocaleString() : 'Never'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ping Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {endpoint.pingLogs.length === 0 ? (
              <div className="text-center text-gray-400 py-4">
                No ping logs available
              </div>
            ) : (
              <div className="space-y-4">
                {endpoint.pingLogs.map((log) => (
                  <div key={log.id} className="border-b border-gray-700 pb-4 last:border-0">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        log.status === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm">
                      <p>Response Time: {log.responseTime}ms</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 