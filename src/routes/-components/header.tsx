import { Plus, ChevronDown, Layers, Sun, Moon } from 'lucide-react'
import {
  useSelectedDeckId,
  useSetIsDeckSelectorOpen,
} from '@/stores/app-state-store'
import { useTheme } from 'next-themes'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'
import { Skeleton } from '@/components/ui/skeleton'

export function Header() {
  const { setTheme, theme } = useTheme()
  const setIsDeckSelectorOpen = useSetIsDeckSelectorOpen()
  const selectedDeckId = useSelectedDeckId()

  const allDecks = useLiveQuery(() => db.decks.toArray())
  const deck = useLiveQuery(
    () => (selectedDeckId ? db.decks.get(selectedDeckId) : undefined),
    [selectedDeckId],
  )

  return (
    <header className="relative border-b border-border/50 backdrop-blur-sm bg-background/80">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo with gradient */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/5 blur-md -z-10" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                Recall
              </h1>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground tracking-wide hidden sm:block">
                Focus on what matters
              </p>
            </div>
          </div>

          {/* Deck Selector - Compact Dropdown */}
          <div className="hidden md:flex items-center gap-2 ml-4 sm:ml-6 pl-4 sm:pl-6 border-l border-border/50">
            {allDecks === undefined ||
            (selectedDeckId && deck === undefined) ? (
              <Skeleton className="h-8 w-32 rounded-lg" />
            ) : allDecks.length === 0 ? (
              <button
                onClick={() => setIsDeckSelectorOpen(true)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all border border-primary/20"
              >
                <Plus className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-medium text-primary shadow-sm">
                  Create deck
                </span>
              </button>
            ) : (
              <button
                onClick={() => setIsDeckSelectorOpen(true)}
                className="group flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-muted/50 transition-all border border-transparent hover:border-border/50"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                  <span className="text-xs sm:text-sm font-medium text-foreground">
                    {deck ? deck.name : 'Select deck'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile deck selector */}
          <button
            onClick={() => setIsDeckSelectorOpen(true)}
            className="md:hidden flex items-center gap-2 px-2.5 h-8 sm:h-9 rounded-lg hover:bg-muted/50 transition-colors group border border-transparent hover:border-border/50"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              {deck && (
                <span className="text-xs font-medium text-foreground max-w-[100px] truncate">
                  {deck.name}
                </span>
              )}
            </div>
          </button>

          {/* Theme toggle */}
          <button
            onClick={() => {
              setTheme(theme === 'dark' ? 'light' : 'dark')
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-center group relative overflow-hidden"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground group-hover:text-foreground" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground group-hover:text-foreground" />
            <span className="sr-only">Toggle theme</span>
          </button>
        </div>
      </div>

      {/* Subtle gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </header>
  )
}
