import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-4 py-10 text-center sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
        Not found
      </p>
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text)] sm:text-5xl">
          That group link does not exist.
        </h1>
        <p className="mx-auto max-w-md text-base leading-7 text-[var(--muted)]">
          The link may be wrong, or the group may no longer be available.
        </p>
      </div>
      <Link href="/" className="button-primary">
        Create a new group
      </Link>
    </main>
  );
}
