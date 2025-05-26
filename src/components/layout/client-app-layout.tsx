// This file is no longer used by the main dashboard page as per the new design.
// Its content can be removed or repurposed. RootLayout now directly renders children.

export function ClientAppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // Minimal passthrough if still imported somewhere, otherwise can be empty.
}
