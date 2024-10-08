import process from 'node:process';
import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  routeRules: {
    '/**': { cors: true },  // Enable CORS globally
    '/tmdb/**': { swr: true, cache: { swr: true, maxAge: 3600, staleMaxAge: 1800 } },  // Enable SWR for TMDB routes
  },
  runtimeConfig: {
    public: {
      tmdb: {
        apiKey: process.env.TMDB_API_KEY || '',
      },
    },
  },
});

// Log a warning if the TMDB API key is missing
if (!process.env.TMDB_API_KEY) {
  console.warn('TMDB_API_KEY is missing, some features may not work properly.');
}
