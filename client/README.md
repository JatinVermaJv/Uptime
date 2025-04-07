# Uptime Monitor - Frontend

This is the frontend application for the Uptime Monitor service, built with Next.js, TypeScript, and Tailwind CSS.

## Project Structure

```
src/
├── app/           # Next.js app directory (pages and layouts)
├── components/    # Reusable UI components
├── services/      # API services and configurations
├── styles/        # Global styles and Tailwind configuration
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- Modern React with Next.js 14
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API calls
- ESLint for code quality
- Responsive design

## Development Guidelines

- Follow the TypeScript and ESLint configurations
- Use Tailwind CSS for styling
- Keep components small and reusable
- Write tests for new features
- Document complex logic

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
