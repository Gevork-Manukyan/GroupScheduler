import CreateGroupForm from "@/components/create-group-form";
import StackDemo from "@/components/stack-demo";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-7 pb-4 sm:px-6 lg:px-10 lg:pt-14">
      <div className="grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-12 [&>*]:min-w-0">
        <div className="flex flex-col gap-4 lg:gap-6">
          <h1 className="font-display text-[clamp(2.05rem,9.4vw,4.25rem)] leading-[0.98] font-extrabold tracking-[-0.038em] text-balance">
            <span className="block text-ink-2">
              The group chat won&rsquo;t pick a date.
            </span>
            <span className="block">Send one link instead.</span>
          </h1>

          <p className="max-w-[46ch] text-base text-pretty text-ink-2">
            Each person taps the days they can make. The days everyone picked
            are your answer.
          </p>

          <StackDemo />
        </div>

        <CreateGroupForm />
      </div>

      <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4 lg:mt-14">
        <p className="label">No accounts</p>
        <p className="label">No email required</p>
        <p className="label">Free</p>
      </div>
    </main>
  );
}
