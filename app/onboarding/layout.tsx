import { Logo } from '@/components/logo'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80b3ff08_1px,transparent_1px),linear-gradient(to_bottom,#80b3ff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center px-4">
          <Logo size="sm" />
          <span className="ml-4 text-sm text-muted-foreground">Setup your profile</span>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
