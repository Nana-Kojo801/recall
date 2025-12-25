export function Footer() {
  return (
    <footer className="relative border-t border-border/50 backdrop-blur-sm mt-auto">
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
          {/* Left side - Branding */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <span className="font-medium">Recall</span>
            <span className="text-border">•</span>
            <span>Focus on what matters</span>
          </div>

          {/* Right side - Links */}
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Keyboard Shortcuts
            </a>
            <span className="text-border">•</span>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Export Data
            </a>
          </div>
        </div>
      </div>

      {/* Subtle gradient line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </footer>
  )
}
