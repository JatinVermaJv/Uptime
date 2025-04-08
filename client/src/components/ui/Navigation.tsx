import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Activity, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/utils/auth';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home
    },
    {
      title: 'Endpoints',
      href: '/endpoints',
      icon: Activity
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ];

  return (
    <nav className="flex items-center space-x-1 lg:space-x-2 px-4 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex-1 flex items-center space-x-4">
        <Link href="/dashboard" className="font-bold text-xl">
          Uptime
        </Link>
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
      <button
        onClick={logout}
        className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </button>
    </nav>
  );
};

export default Navigation; 