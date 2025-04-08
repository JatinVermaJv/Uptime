'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Endpoint, ApiResponse, PingLog } from '@/types';
import Navigation from '@/components/ui/Navigation';

export default function EndpointDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [endpoint, setEndpoint] = useState<Endpoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [id] = useState(params.id as string);

  const fetchEndpoint = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.endpoints.getById(id);
      setEndpoint(response.data);
    } catch (err) {
      toast.error('Failed to fetch endpoint details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEndpoint();
  }, [fetchEndpoint]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this endpoint?')) return;
    
    try {
      await api.endpoints.delete(id);
      toast.success('Endpoint deleted successfully');
      router.push('/endpoints');
    } catch (err) {
      toast.error('Failed to delete endpoint');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Navigation />
        <div>Loading...</div>
      </div>
    );
  }

  if (!endpoint) {
    return (
      <div className="p-8">
        <Navigation />
        <div>Endpoint not found</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Navigation />
      <Card>
        <CardHeader>
          <CardTitle>Endpoint Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p>{endpoint.name}</p>
            </div>
            <div>
              <h3 className="font-medium">URL</h3>
              <p>{endpoint.url}</p>
            </div>
            <div>
              <h3 className="font-medium">Check Interval</h3>
              <p>{endpoint.interval} minutes</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p className={endpoint.status === 'up' ? 'text-green-500' : 'text-red-500'}>
                {endpoint.status.toUpperCase()}
              </p>
            </div>
            <div className="pt-4">
              <Button variant="destructive" onClick={handleDelete}>
                Delete Endpoint
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 