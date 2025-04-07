import React from 'react';
import { PingLog } from '@/types';

interface PingLogTableProps {
  logs: PingLog[];
}

const PingLogTable: React.FC<PingLogTableProps> = ({ logs }) => {
  const getStatusColor = (status: 'success' | 'failure') => {
    return status === 'success' ? 'status-badge-success' : 'status-badge-danger';
  };

  const formatResponseTime = (ms: number) => {
    return `${ms.toFixed(2)}ms`;
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead className="table-header">
          <tr>
            <th className="table-header-cell">Timestamp</th>
            <th className="table-header-cell">Status</th>
            <th className="table-header-cell">Response Time</th>
            <th className="table-header-cell">Status Code</th>
            <th className="table-header-cell">Error</th>
          </tr>
        </thead>
        <tbody className="table-body">
          {logs.map((log) => (
            <tr key={log.id} className="table-row">
              <td className="table-cell">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="table-cell">
                <span className={`status-badge ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
              </td>
              <td className="table-cell">
                {formatResponseTime(log.responseTime)}
              </td>
              <td className="table-cell">
                {log.statusCode || '-'}
              </td>
              <td className="table-cell">
                {log.error || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PingLogTable; 