import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Activity, Bell, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Uptime Monitor</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Monitor Your Website&apos;s Uptime
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get instant alerts when your website goes down. Monitor multiple endpoints,
              track response times, and ensure your services are always available.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register">
                <Button size="lg">
                  Start Monitoring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-muted-foreground">
                  Get instant notifications when your services go down or experience issues.
                </p>
              </div>
              <div className="text-center p-6">
                <Bell className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Alerts</h3>
                <p className="text-muted-foreground">
                  Receive alerts via email, SMS, or webhook when issues are detected.
                </p>
              </div>
              <div className="text-center p-6">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Uptime History</h3>
                <p className="text-muted-foreground">
                  Track your service&apos;s uptime history and performance metrics over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses monitoring their services with Uptime Monitor.
            </p>
            <Link href="/register">
              <Button size="lg">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Uptime Monitor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
