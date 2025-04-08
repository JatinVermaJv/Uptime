'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';
import { Endpoint } from '@/types';
import EndpointCard from '@/components/ui/EndpointCard';

export default function EndpointsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    interval: 1
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      interval: 1
    });
    setEditingEndpoint(null);
  };

  const fetchEndpoints = async () => {
    try {
      setIsLoading(true);
      const response = await api.endpoints.getAll();
      setEndpoints(response.data);
    } catch (err) {
      toast.error('Failed to fetch endpoints');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEndpoints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const name = formData.name.trim();
      const url = formData.url.trim();
      const interval = Number(formData.interval);

      if (!name) {
        toast.error('Name is required');
        return;
      }

      let validUrl: URL;
      try {
        validUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
        if (!validUrl.protocol || !validUrl.host) {
          throw new Error('Invalid URL');
        }
      } catch {
        toast.error('Please enter a valid URL (e.g., https://example.com)');
        return;
      }

      const intervalInSeconds = interval * 60;
      if (isNaN(intervalInSeconds) || intervalInSeconds < 10) {
        toast.error('Interval must be at least 10 seconds');
        return;
      }

      const payload: Omit<Endpoint, 'id'> = {
        name,
        url: validUrl.href,
        interval: intervalInSeconds,
        status: 'unknown' as const,
        userId: '',
        pingLogs: []
      };

      if (editingEndpoint) {
        await api.endpoints.update(editingEndpoint.id, {
          name,
          url: validUrl.href,
          interval: intervalInSeconds
        });
        toast.success('Endpoint updated successfully');
      } else {
        await api.endpoints.create(payload);
        toast.success('Endpoint created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchEndpoints();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save endpoint';
      toast.error(message);
    }
  };

  const handleEdit = (endpoint: Endpoint) => {
    setEditingEndpoint(endpoint);
    setFormData({
      name: endpoint.name,
      url: endpoint.url,
      interval: Math.floor(endpoint.interval / 60)
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (endpoint: Endpoint) => {
    try {
      await api.endpoints.delete(endpoint.id);
      toast.success('Endpoint deleted successfully');
      fetchEndpoints();
    } catch (err) {
      toast.error('Failed to delete endpoint');
    }
  };

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    endpoint.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Endpoints</h1>
          <p className="text-muted-foreground">Monitor your endpoints and track their status</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Endpoint
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search endpoints..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredEndpoints.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchQuery ? 'No endpoints match your search' : 'No endpoints found'}
          </div>
          {!searchQuery && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add your first endpoint
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEndpoints.map((endpoint) => (
            <EndpointCard
              key={endpoint.id}
              endpoint={endpoint}
              onEdit={() => handleEdit(endpoint)}
              onDelete={() => handleDelete(endpoint)}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEndpoint ? 'Edit Endpoint' : 'Add Endpoint'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="My Website"
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="interval">Check Interval (minutes)</Label>
              <Input
                id="interval"
                type="number"
                min="0.17"
                max="60"
                step="0.01"
                value={formData.interval}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value) && value >= 0.17 && value <= 60) {
                    setFormData({ ...formData, interval: value });
                  }
                }}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Minimum interval is 10 seconds (0.17 minutes)
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEndpoint ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 