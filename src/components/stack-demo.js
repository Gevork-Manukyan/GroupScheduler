"use client";

import { useState } from "react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

// Three replies are already in; you are the fourth. `true` means that person
// can make that day. As it stands only Wednesday works for all four — picking
// Friday in your own row opens a second answer.
const REPLIES = [
  { name: "ana", free: [false, true, true, false, true] },
  { name: "theo", free: [true, false, true, true, true] },
  { name: "priya", free: [false, false, true, true, true] },
];

const MY_START = [true, true, true, true, false];

function joinDays(days) {
  if (days.length === 1) {
    return days[0];
  }

  return `${days.slice(0, -1).join(", ")} and ${days[days.length - 1]}`;
}

export default function StackDemo() {
  const [mine, setMine] = useState(MY_START);

  function toggle(index) {
    setMine((current) =>
      current.map((value, position) => (position === index ? !value : value)),
    );
  }

  const openDays = DAYS.filter(
    (day, index) => mine[index] && REPLIES.every((person) => person.free[index]),
  );

  return (
    <figure className="stack m-0 px-3.5 pt-4 pb-4 sm:px-5">
      <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <p className="label text-box-ink">Three replies, plus yours</p>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.08em] text-box-ink/80">
          Tap your row
        </span>
      </div>

      <p className="sr-only">
        A demonstration. Your row is editable; the other three have already
        replied.{" "}
        {REPLIES.map(
          (person) =>
            `${person.name} can make ${DAYS.filter((day, index) => person.free[index]).join(" and ")}.`,
        ).join(" ")}
      </p>

      <div className="grid grid-cols-[3rem_repeat(5,minmax(0,1fr))] items-center gap-1.5">
        <span />
        {DAYS.map((day) => (
          <span
            key={day}
            className="pb-0.5 text-center font-mono text-[0.6875rem] font-medium text-[#d6ded8]"
          >
            {day}
          </span>
        ))}

        <span className="truncate font-mono text-[0.6875rem] text-lamp-soft">
          you
        </span>
        {DAYS.map((day, index) => (
          <button
            key={day}
            type="button"
            aria-pressed={mine[index]}
            aria-label={`I can make ${day}`}
            onClick={() => toggle(index)}
            className={`h-11 rounded-[4px] border transition-[background-color,border-color,transform] duration-150 hover:border-lamp-soft active:scale-95 ${
              mine[index]
                ? "border-cell-open-line bg-cell-open shadow-[inset_0_1px_0_rgba(255,231,176,0.09)]"
                : "border-cell-shut-line bg-cell-shut"
            }`}
          />
        ))}

        {REPLIES.map((person) => (
          <Row key={person.name} person={person} />
        ))}

        <div className="col-span-full my-2.5 mb-1 h-px bg-box-rule" />

        <span className="font-mono text-[0.6875rem] text-lamp-soft">all 4</span>
        {DAYS.map((day, index) => {
          const lit = mine[index] && REPLIES.every((person) => person.free[index]);

          return (
            <div
              key={day}
              className={`h-11 rounded-[4px] border transition-[background-color,border-color,box-shadow] duration-300 ${
                lit
                  ? "border-lamp-soft bg-gradient-to-b from-lamp-soft to-lamp shadow-lit"
                  : "border-cell-shut-line bg-cell-shut"
              }`}
            />
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="mt-4 border-t border-box-rule pt-3 font-mono text-xs tabular-nums text-box-ink"
      >
        {openDays.length === 0 ? (
          "No day works for all 4 yet."
        ) : (
          <>
            <span className="font-medium text-lamp-soft">
              {joinDays(openDays)}
            </span>
            {openDays.length === 1 ? " works" : " work"} for all 4.
          </>
        )}
      </p>
    </figure>
  );
}

function Row({ person }) {
  return (
    <>
      <span className="truncate font-mono text-[0.6875rem] text-box-ink">
        {person.name}
      </span>
      {DAYS.map((day, index) => (
        <div
          key={day}
          aria-hidden="true"
          className={`h-11 rounded-[4px] border opacity-60 ${
            person.free[index]
              ? "border-cell-open-line bg-cell-open shadow-[inset_0_1px_0_rgba(255,231,176,0.09)]"
              : "border-cell-shut-line bg-cell-shut"
          }`}
        />
      ))}
    </>
  );
}
