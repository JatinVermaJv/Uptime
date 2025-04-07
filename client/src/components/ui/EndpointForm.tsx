import React, { useState } from 'react';
import { Endpoint } from '@/types';

interface EndpointFormProps {
  initialData?: Partial<Endpoint>;
  onSubmit: (data: Partial<Endpoint>) => void;
  onCancel: () => void;
}

const EndpointForm: React.FC<EndpointFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<Endpoint>>({
    name: initialData.name || '',
    url: initialData.url || '',
    interval: initialData.interval || 60,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.url?.trim()) {
      newErrors.url = 'URL is required';
    } else if (!formData.url.startsWith('http://') && !formData.url.startsWith('https://')) {
      newErrors.url = 'URL must start with http:// or https://';
    }

    if (!formData.interval || formData.interval < 30) {
      newErrors.interval = 'Interval must be at least 30 seconds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="card-header">
        {initialData.id ? 'Edit Endpoint' : 'Add New Endpoint'}
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field mt-1"
            placeholder="My API Endpoint"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-300">
            URL
          </label>
          <input
            type="url"
            id="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="input-field mt-1"
            placeholder="https://api.example.com"
          />
          {errors.url && (
            <p className="mt-1 text-sm text-red-500">{errors.url}</p>
          )}
        </div>

        <div>
          <label htmlFor="interval" className="block text-sm font-medium text-gray-300">
            Check Interval (seconds)
          </label>
          <input
            type="number"
            id="interval"
            value={formData.interval}
            onChange={(e) => setFormData({ ...formData, interval: Number(e.target.value) })}
            className="input-field mt-1"
            min="30"
            step="30"
          />
          {errors.interval && (
            <p className="mt-1 text-sm text-red-500">{errors.interval}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex space-x-2">
        <button type="submit" className="btn-primary flex-1">
          {initialData.id ? 'Update' : 'Add'} Endpoint
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EndpointForm; 