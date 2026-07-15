export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-[var(--line)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-6 text-sm text-[var(--muted)] sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>© {year} Gevork Manukyan</p>
        <a
          href="https://gevorkmanukyan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition hover:text-[var(--text)]"
        >
          Built by Gevork Manukyan <span aria-hidden="true">→</span>
        </a>
      </div>
    </footer>
  );
}
