import { ThemeProvider } from '@/components/theme-provider'
import { Outlet, createRootRoute } from '@tanstack/react-router'

import { useEffect } from 'react'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  useEffect(() => {
    document.body.classList.add('app-loaded')
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Outlet />
    </ThemeProvider>
  )
}
