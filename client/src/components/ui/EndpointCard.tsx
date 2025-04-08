import React from 'react';
import { Endpoint } from '@/types';
import { Activity, Clock, Globe, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface EndpointCardProps {
  endpoint: Endpoint;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EndpointCard: React.FC<EndpointCardProps> = ({ endpoint, onEdit, onDelete }) => {
  const getStatusColor = (status?: 'up' | 'down' | 'unknown') => {
    switch (status) {
      case 'up':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'down':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const getStatusIcon = (status?: 'up' | 'down' | 'unknown') => {
    switch (status) {
      case 'up':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'down':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status?: 'up' | 'down' | 'unknown') => {
    switch (status) {
      case 'up':
        return 'Up';
      case 'down':
        return 'Down';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{endpoint.name}</h3>
            <p className="text-sm text-muted-foreground">{endpoint.url}</p>
          </div>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(endpoint.status)}`}>
          {getStatusIcon(endpoint.status)}
          <span className="text-sm font-medium">{getStatusText(endpoint.status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Interval</p>
            <p className="text-sm font-medium">{(endpoint.interval / 60).toFixed(2)} minutes</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Last Checked</p>
            <p className="text-sm font-medium">
              {endpoint.lastChecked
                ? new Date(endpoint.lastChecked).toLocaleString()
                : 'Never'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="flex-1 btn-secondary flex items-center justify-center space-x-2"
        >
          <span>Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="flex-1 btn-danger flex items-center justify-center space-x-2"
        >
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default EndpointCard; 