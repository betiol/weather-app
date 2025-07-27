import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { trpc } from './utils/trpc'
import { AuthProvider } from './contexts/AuthContext'
import { auth } from './config/firebase'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/trpc`,
      headers: async () => {
        try {
          const user = auth.currentUser;
          if (user) {
            const token = await user.getIdToken();
            return {
              Authorization: `Bearer ${token}`,
            };
          }
          return {};
        } catch (error) {
          return {};
        }
      },
    }),
  ],
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>,
) 