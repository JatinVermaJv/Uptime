'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { settings } from '@/services/api';
import { handleApiError } from '@/services/api';
import { Switch } from '@/components/ui/switch';

interface Settings {
  notifications: boolean;
  emailAlerts: boolean;
  refreshInterval: number;
  darkMode: boolean;
}

export default function SettingsPage() {
  const [settingsData, setSettingsData] = useState<Settings>({
    notifications: true,
    emailAlerts: false,
    refreshInterval: 60,
    darkMode: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settings.get();
        setSettingsData(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await settings.update(settingsData);
      setSuccess('Settings updated successfully');
      setError(null);
    } catch (err) {
      console.error('Failed to update settings:', err);
      setError(handleApiError(err));
      setSuccess(null);
    }
  };

  const handleSettingChange = (key: keyof Settings, value: boolean | number) => {
    setSettingsData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Settings */}
          <div className="card">
            <h2 className="card-header">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Enable Notifications</h3>
                  <p className="text-sm text-gray-400">Receive browser notifications for endpoint status changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settingsData.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Email Alerts</h3>
                  <p className="text-sm text-gray-400">Receive email notifications for critical issues</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settingsData.emailAlerts}
                    onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="card">
            <h2 className="card-header">Display</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-400">Use dark theme for the application</p>
                </div>
                <Switch
                  checked={settingsData.darkMode}
                  onChange={(checked) => handleSettingChange('darkMode', checked)}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="refreshInterval" className="block text-sm font-medium text-white">
                  Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  id="refreshInterval"
                  value={settingsData.refreshInterval}
                  onChange={(e) => handleSettingChange('refreshInterval', Number(e.target.value))}
                  className="input-field mt-1"
                  min="30"
                  step="30"
                />
                <p className="mt-1 text-sm text-gray-400">
                  How often to refresh endpoint status
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Layout>
  );
} 