import React from 'react';
import { Endpoint } from '@/types';

interface EndpointCardProps {
  endpoint: Endpoint;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, onEdit, onDelete }) => {
  const getStatusColor = (status?: 'up' | 'down') => {
    switch (status) {
      case 'up':
        return 'status-badge-success';
      case 'down':
        return 'status-badge-danger';
      default:
        return 'status-badge-warning';
    }
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">{endpoint.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{endpoint.url}</p>
        </div>
        <span className={`status-badge ${getStatusColor(endpoint.status)}`}>
          {endpoint.status || 'Unknown'}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Interval:</span>
          <span className="text-white">{endpoint.interval} seconds</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Last Checked:</span>
          <span className="text-white">
            {endpoint.lastChecked
              ? new Date(endpoint.lastChecked).toLocaleString()
              : 'Never'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex space-x-2">
        <button
          onClick={onEdit}
          className="btn-secondary flex-1"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="btn-danger flex-1"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EndpointCard; 