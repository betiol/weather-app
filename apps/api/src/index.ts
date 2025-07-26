import 'dotenv/config';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from './trpc';
import { appRouter } from './router';

const server = Bun.serve({
  port: Number(process.env.PORT) || 3001,
  async fetch(req) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(req.url);

    if (url.pathname === '/health') {
      return new Response(
        JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (url.pathname.startsWith('/trpc')) {
      const response = await fetchRequestHandler({
        endpoint: '/trpc',
        req,
        router: appRouter,
        createContext: () => createContext(),
      });
      
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }

    return new Response(
      JSON.stringify({ error: 'Route not found' }),
      { 
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  },
});

console.log(`tRPC Server running on http://localhost:${server.port}`);
console.log(`tRPC endpoint: http://localhost:${server.port}/trpc`); 