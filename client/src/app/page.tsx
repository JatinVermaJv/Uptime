'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Activity, Bell, Clock, Shield } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Monitor your endpoints in real-time with instant notifications when issues arise.'
    },
    {
      icon: Clock,
      title: 'Flexible Intervals',
      description: 'Set custom monitoring intervals from 10 seconds to 60 minutes.'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get notified through email or push notifications when your endpoints are down.'
    },
    {
      icon: Shield,
      title: 'Reliable Service',
      description: 'Trust in our robust monitoring system to keep your services running smoothly.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-small" />
        <div className="relative pt-20 pb-24 px-6 sm:pt-32 sm:px-8 md:px-12 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center space-y-8">
              <h1 className="text-4xl font-bold sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
                Monitor Your Endpoints with Confidence
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Keep track of your services with real-time monitoring, instant notifications,
                and detailed analytics. Never miss a downtime again.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={() => router.push('/register')}>
                  Get Started
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push('/login')}>
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 sm:px-8 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why Choose Our Service?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to ensure your services are running smoothly
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="relative group rounded-lg border p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-6 sm:px-8 md:px-12 lg:px-20 bg-primary/5">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of users who trust our service for their monitoring needs.
          </p>
          <Button size="lg" className="mt-8" onClick={() => router.push('/register')}>
            Start Monitoring Now
          </Button>
        </div>
      </div>
    </div>
  );
}
