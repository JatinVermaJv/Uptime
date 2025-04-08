# Uptime Monitor

A full-stack web application for monitoring the uptime and performance of web endpoints. Built with Next.js, TypeScript, and Node.js.

## Features

- 🔐 **User Authentication**: Secure login and registration system with JWT tokens
- 📊 **Real-time Monitoring**: Track endpoint status with customizable check intervals
- 📈 **Performance Metrics**: Monitor response times and uptime statistics
- 🔔 **Status Notifications**: Visual indicators for endpoint health status
- 📱 **Responsive Design**: Modern UI that works on all devices
- 🔄 **Auto-refresh**: Real-time updates of endpoint status

## Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- React Query (for data fetching)
- Axios (for API calls)

### Backend
- Node.js
- Express.js
- Prisma (ORM)
- PostgreSQL
- JWT (Authentication)
- Node-cron (Scheduled tasks)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/uptime-monitor.git
cd uptime-monitor
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
```bash
# Server (.env)
DATABASE_URL="postgresql://user:password@localhost:5432/uptime"
JWT_SECRET="your-secret-key"
PORT=3001

# Client (.env.local)
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

4. Start the development servers
```bash
# Start the server
cd server
npm run dev

# Start the client
cd ../client
npm run dev
```

## Project Structure

```
uptime-monitor/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic
│   │   └── db/           # Database configuration
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
