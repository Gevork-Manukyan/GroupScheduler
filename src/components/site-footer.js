export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-rule">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-5 py-6 text-[0.8125rem] text-ink-2 sm:flex-row sm:justify-between sm:px-6 lg:px-10">
        <p>© {year} Gevork Manukyan</p>
        <a
          href="https://gevorkmanukyan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline decoration-rule underline-offset-[3px] transition-colors hover:text-ink"
        >
          Built by Gevork Manukyan <span aria-hidden="true">→</span>
        </a>
      </div>
    </footer>
  );
}
