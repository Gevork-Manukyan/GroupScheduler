import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-5 py-12 text-center sm:px-6">
      <p className="label">Not found</p>
      <div className="flex flex-col gap-3">
        <h1 className="font-display text-[clamp(1.9rem,8vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance">
          That group link doesn&rsquo;t exist.
        </h1>
        <p className="mx-auto max-w-md text-base text-pretty text-ink-2">
          The link may be wrong, or the group may have been removed.
        </p>
      </div>
      <Link href="/" className="btn">
        Create a new group
      </Link>
    </main>
  );
}
