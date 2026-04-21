export default function TopNav() {
  return (
    <header className="flex items-center justify-between h-14 px-6 border-b bg-card">
      <div className="flex items-center gap-8">
        <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
          <img
            src={`${import.meta.env.BASE_URL}mercadeo-aplicado-logo.png`}
            alt="Mercadeo Aplicado"
            className="h-8 w-auto"
          />
        </nav>
      </div>
    </header>
  );
}
