import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { store } from './redux/store.ts'
import { Provider } from 'react-redux'
import { ThemeProvider } from './components/theme-provider' 
import AuthProvider from './Auth/AuthProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
