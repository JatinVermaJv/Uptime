'use client';

import { useState } from 'react';
import EndpointList from '../components/dashboard/EndpointList';

export default function DashboardPage() {
  const [showAddEndpoint, setShowAddEndpoint] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <button
              onClick={() => setShowAddEndpoint(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Add Endpoint
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Monitored Endpoints
            </h2>
            <EndpointList />
          </div>
        </div>
      </div>
    </div>
  );
} 