"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  buildDateRange,
  formatDateLabel,
  getLocalDateInputValue,
  MAX_GROUP_RANGE_DAYS,
  normalizeDates,
  shiftDateInputValue,
} from "@/lib/scheduler";

export default function CreateGroupForm() {
  const router = useRouter();
  const initialStartDate = getLocalDateInputValue();
  const [selectionMode, setSelectionMode] = useState("range");
  const [groupName, setGroupName] = useState("");
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(
    shiftDateInputValue(initialStartDate, 6),
  );
  const [specificDateInput, setSpecificDateInput] = useState(initialStartDate);
  const [specificDates, setSpecificDates] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  let rangeError = "";

  try {
    buildDateRange(startDate, endDate);
  } catch (previewError) {
    rangeError = previewError.message;
  }

  function addSpecificDate() {
    if (!specificDateInput) {
      return;
    }

    setSpecificDates((currentDates) =>
      normalizeDates([...currentDates, specificDateInput]),
    );
  }

  function removeSpecificDate(dateToRemove) {
    setSpecificDates((currentDates) =>
      currentDates.filter((date) => date !== dateToRemove),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const requestBody =
        selectionMode === "range"
          ? {
              name: groupName,
              startDate,
              endDate,
            }
          : {
              name: groupName,
              dates: specificDates,
            };

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create the group.");
      }

      router.push(`/groups/${payload.groupId}`);
    } catch (requestError) {
      setError(requestError.message);
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-[18px] px-4 py-5 sm:px-6 sm:py-6 lg:sticky lg:top-7"
    >
      <div className="flex flex-col gap-[7px]">
        <label htmlFor="group-name" className="label">
          Group name
        </label>
        <input
          id="group-name"
          type="text"
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
          placeholder="Dinner with the group"
          className="input-field"
          maxLength={80}
        />
      </div>

      <div className="flex flex-col gap-[7px]">
        <span id="date-setup" className="label">
          Which days can people choose from
        </span>

        <div className="grid grid-cols-2 gap-2" role="group" aria-labelledby="date-setup">
          <ModeButton
            selected={selectionMode === "range"}
            onClick={() => setSelectionMode("range")}
            title="A date range"
            detail="All days in between"
          />
          <ModeButton
            selected={selectionMode === "specific"}
            onClick={() => setSelectionMode("specific")}
            title="Exact dates"
            detail="Only the days you pick"
          />
        </div>
      </div>

      {selectionMode === "range" ? (
        <>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-[7px]">
              <label htmlFor="start-date" className="label">
                From
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="input-field font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-[7px]">
              <label htmlFor="end-date" className="label">
                To
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="input-field font-mono text-sm"
              />
            </div>
          </div>

          {rangeError ? (
            <p className="notice notice-error">{rangeError}</p>
          ) : (
            <p className="notice notice-quiet">
              Everyone picks from the days in this range. Keep it to{" "}
              {MAX_GROUP_RANGE_DAYS} days or fewer so the shared page stays easy
              to use.
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <input
              type="date"
              value={specificDateInput}
              onChange={(event) => setSpecificDateInput(event.target.value)}
              aria-label="Add a specific date"
              className="input-field min-w-0 flex-1 font-mono text-sm"
            />
            <button
              type="button"
              onClick={addSpecificDate}
              className="btn-quiet shrink-0"
            >
              Add date
            </button>
          </div>

          {specificDates.length > 0 ? (
            <ul className="flex list-none flex-wrap gap-2 p-0">
              {specificDates.map((date) => (
                <li key={date}>
                  <button
                    type="button"
                    onClick={() => removeSpecificDate(date)}
                    aria-label={`Remove ${formatDateLabel(date)}`}
                    className="flex min-h-11 items-center gap-2.5 rounded-md border border-rule bg-paper px-3 font-mono text-xs text-ink transition-colors hover:border-ink"
                  >
                    <span>{formatDateLabel(date)}</span>
                    <span aria-hidden="true" className="text-ink-2">
                      &times;
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="notice notice-quiet">
              Add the exact dates people should choose between. Up to{" "}
              {MAX_GROUP_RANGE_DAYS}.
            </p>
          )}
        </>
      )}

      {error ? <p className="notice notice-error">{error}</p> : null}

      <button
        type="submit"
        disabled={
          isSubmitting ||
          (selectionMode === "range"
            ? Boolean(rangeError)
            : specificDates.length === 0)
        }
        className="btn w-full justify-between"
      >
        {isSubmitting ? "Creating group..." : "Create group"}
        <Arrow />
      </button>

      <p className="text-[0.8125rem] text-ink-2">
        You&rsquo;ll get a link to share. Nobody needs an account.
      </p>
    </form>
  );
}

function ModeButton({ selected, onClick, title, detail }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-12 rounded-md border px-3 py-2.5 text-left transition-colors ${
        selected
          ? "border-ink bg-surface shadow-[inset_0_0_0_1px_var(--color-ink)]"
          : "border-rule bg-paper"
      }`}
    >
      <span className="block text-[0.9375rem] font-semibold text-ink">
        {title}
      </span>
      <span className="block text-xs leading-snug text-ink-2">{detail}</span>
    </button>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3 9h11M9.5 4.5 14 9l-4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
