'use client';

import { useState } from 'react';

export default function EndpointList() {
  const [endpoints, setEndpoints] = useState([
    // Sample data - will be replaced with actual API data
    {
      id: 1,
      name: 'API Server',
      url: 'https://api.example.com',
      status: 'up',
      lastChecked: '2024-04-07T12:00:00Z',
      responseTime: 150,
    },
    {
      id: 2,
      name: 'Database',
      url: 'https://db.example.com',
      status: 'down',
      lastChecked: '2024-04-07T12:00:00Z',
      responseTime: 0,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'up':
        return 'bg-green-100 text-green-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {endpoints.map((endpoint) => (
          <li key={endpoint.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {endpoint.name}
                  </p>
                  <span
                    className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      endpoint.status
                    )}`}
                  >
                    {endpoint.status.toUpperCase()}
                  </span>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="text-sm text-gray-500">
                    {endpoint.responseTime}ms
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {endpoint.url}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Last checked:{' '}
                    {new Date(endpoint.lastChecked).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 