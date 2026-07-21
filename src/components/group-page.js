"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"];

function getStorageKey(groupId) {
  return `group-scheduler:${groupId}:editor`;
}

function readSavedEditor(groupId) {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const value = window.localStorage.getItem(getStorageKey(groupId));

    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeSavedEditor(groupId, editor) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getStorageKey(groupId), JSON.stringify(editor));
}

function clearSavedEditor(groupId) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStorageKey(groupId));
}

function getDateParts(value) {
  const [year, month, day] = value.split("-").map(Number);

  return {
    year,
    monthIndex: month - 1,
    day,
  };
}

function toMonthKey(value) {
  const { year, monthIndex } = getDateParts(value);

  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function toDateInputValue(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatMonthLabel(year, monthIndex) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthIndex, 1));
}

function formatShortLabel(value) {
  const { year, monthIndex, day } = getDateParts(value);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(year, monthIndex, day));
}

/*
  Lay each month out in weeks, then drop any week holding no group date. A
  60-day range spanning three months would otherwise bury a phone screen in
  empty grid.
*/
function buildCalendarMonths(dateSummaries) {
  const summaryMap = new Map(
    dateSummaries.map((summary) => [summary.date, summary]),
  );
  const monthKeys = [
    ...new Set(dateSummaries.map((summary) => toMonthKey(summary.date))),
  ].sort();

  return monthKeys
    .map((monthKey) => {
      const [year, monthValue] = monthKey.split("-").map(Number);
      const monthIndex = monthValue - 1;
      const firstDay = new Date(year, monthIndex, 1).getDay();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      const cells = [];

      for (let index = 0; index < firstDay; index += 1) {
        cells.push({ id: `${monthKey}-pad-${index}`, isPadding: true });
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = toDateInputValue(year, monthIndex, day);

        cells.push({
          id: date,
          date,
          day,
          summary: summaryMap.get(date) || null,
        });
      }

      while (cells.length % 7 !== 0) {
        cells.push({ id: `${monthKey}-pad-end-${cells.length}`, isPadding: true });
      }

      const liveCells = [];

      for (let start = 0; start < cells.length; start += 7) {
        const week = cells.slice(start, start + 7);

        if (week.some((cell) => cell.summary)) {
          liveCells.push(...week);
        }
      }

      return {
        key: monthKey,
        label: formatMonthLabel(year, monthIndex),
        cells: liveCells,
      };
    })
    .filter((month) => month.cells.length > 0);
}

/*
  Light leaks slowly and then all at once. A near-miss is not a match, so the
  curve keeps partial agreement dim and lets a real consensus carry the glow.
*/
function litAlpha(availableCount, responseCount) {
  if (!responseCount) {
    return 0;
  }

  return (Math.pow(availableCount / responseCount, 2.2) * 0.5).toFixed(3);
}

function joinLabels(labels) {
  if (labels.length === 1) {
    return labels[0];
  }

  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function CalendarGrid({ months, responseCount, isPicked, onToggle }) {
  return (
    <div className="flex flex-col gap-[18px]">
      {months.map((month) => (
        <section key={month.key}>
          <p className="mb-2 font-mono text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-lamp-soft">
            {month.label}
          </p>

          <div className="mb-[5px] grid grid-cols-7 gap-1">
            {WEEKDAY_INITIALS.map((initial, index) => (
              <span
                key={`${month.key}-dow-${index}`}
                className="text-center font-mono text-[0.625rem] text-box-ink/75"
              >
                {initial}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-[3px] sm:gap-1">
            {month.cells.map((cell) => {
              if (cell.isPadding || !cell.summary) {
                return (
                  <div
                    key={cell.id}
                    aria-hidden="true"
                    className="flex aspect-square min-h-11 items-center justify-center rounded-[4px] font-mono text-[0.8125rem] text-box-ink/45"
                  >
                    {cell.isPadding ? "" : cell.day}
                  </div>
                );
              }

              const picked = isPicked(cell.date);
              const lit = cell.summary.allAvailable;

              return (
                <button
                  key={cell.id}
                  type="button"
                  onClick={() => onToggle(cell.date)}
                  aria-pressed={picked}
                  aria-label={`${formatShortLabel(cell.date)} — ${cell.summary.availableCount} of ${responseCount} can make it${picked ? ", including you" : ""}`}
                  style={
                    lit
                      ? undefined
                      : {
                          backgroundImage: `linear-gradient(0deg, rgba(255,194,75,${litAlpha(cell.summary.availableCount, responseCount)}), rgba(255,194,75,${litAlpha(cell.summary.availableCount, responseCount)}))`,
                        }
                  }
                  className={`relative flex aspect-square min-h-11 items-center justify-center rounded-[4px] border font-mono text-[0.8125rem] tabular-nums transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-95 ${
                    lit
                      ? "border-lamp-soft bg-gradient-to-b from-lamp-soft to-lamp text-[#1a1204] shadow-lit"
                      : picked
                        ? "border-box-rule bg-cell-mine text-[#dfe6e0] shadow-[inset_0_0_0_2px_rgba(255,231,176,0.85)] hover:border-lamp-soft"
                        : "border-cell-shut-line bg-cell-shut text-[#dfe6e0] hover:border-lamp-soft"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function DateList({ dateSummaries, responseCount, isPicked, onToggle }) {
  return (
    <div className="flex flex-col gap-1">
      {dateSummaries.map((summary) => {
        const picked = isPicked(summary.date);
        const ratio = responseCount
          ? (summary.availableCount / responseCount) * 100
          : 0;

        return (
          <button
            key={summary.date}
            type="button"
            onClick={() => onToggle(summary.date)}
            aria-pressed={picked}
            className={`grid min-h-[46px] w-full grid-cols-[5.75rem_1fr_auto] items-center gap-3 rounded-[5px] border px-3 text-left font-mono text-[0.6875rem] tabular-nums transition-colors hover:border-lamp-soft ${
              summary.allAvailable
                ? "border-lamp-soft/55 bg-cell-shut"
                : picked
                  ? "border-box-rule bg-cell-mine"
                  : "border-cell-shut-line bg-cell-shut"
            }`}
          >
            <span
              className={`whitespace-nowrap ${picked ? "text-lamp-soft" : "text-[#dfe6e0]"}`}
            >
              {formatShortLabel(summary.date)}
            </span>

            <span className="h-2 overflow-hidden rounded-full bg-[#1c2620]">
              {/* the real ratio — the lit curve above is perception, not data */}
              <span
                className="block h-full rounded-full bg-lamp transition-[width] duration-200"
                style={{ width: `${ratio}%` }}
              />
            </span>

            <span
              className={`whitespace-nowrap ${summary.allAvailable ? "text-lamp-soft" : "text-box-ink"}`}
            >
              {summary.availableCount} of {responseCount}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-[18px] gap-y-[9px] border-t border-box-rule pt-[13px] font-mono text-[0.625rem] tracking-[0.06em] uppercase text-box-ink">
      <span className="inline-flex items-center gap-2">
        <span>Nobody</span>
        <span aria-hidden="true" className="flex gap-0.5">
          {[0, 0.05, 0.13, 0.29].map((alpha) => (
            <span
              key={alpha}
              className="h-[11px] w-[15px] rounded-[2px] border border-cell-shut-line bg-cell-shut"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(255,194,75,${alpha}), rgba(255,194,75,${alpha}))`,
              }}
            />
          ))}
          <span className="h-[11px] w-[15px] rounded-[2px] border border-lamp-soft bg-gradient-to-b from-lamp-soft to-lamp" />
        </span>
        <span>Everyone so far</span>
      </span>

      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-[11px] w-[15px] rounded-[2px] border border-box-rule bg-cell-mine shadow-[inset_0_0_0_2px_rgba(255,231,176,0.85)]"
        />
        <span>You picked it</span>
      </span>
    </div>
  );
}

export default function GroupPage({ groupId, initialGroup }) {
  const [group, setGroup] = useState(initialGroup);
  const [viewMode, setViewMode] = useState("calendar");
  const [name, setName] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [editor, setEditor] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState("idle");
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoadedSavedResponse, setHasLoadedSavedResponse] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if (hasLoadedSavedResponse) {
      return;
    }

    const savedEditor = readSavedEditor(groupId);

    if (!savedEditor) {
      setHasLoadedSavedResponse(true);
      return;
    }

    const savedResponse = group.responses.find(
      (response) => response.id === savedEditor.responseId,
    );

    if (!savedResponse) {
      clearSavedEditor(groupId);
      setHasLoadedSavedResponse(true);
      return;
    }

    setEditor(savedEditor);
    setName(savedResponse.name);
    setAvailableDates(savedResponse.availableDates);
    setHasLoadedSavedResponse(true);
  }, [groupId, group.responses, hasLoadedSavedResponse]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setShareUrl(window.location.href);
  }, []);

  function toggleDate(date) {
    setAvailableDates((currentDates) => {
      if (currentDates.includes(date)) {
        return currentDates.filter((currentDate) => currentDate !== date);
      }

      return [...currentDates, date].sort();
    });
  }

  async function handleCopyLink() {
    if (!shareUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("error");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFeedback("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/groups/${groupId}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // availableDates only — validateResponseInput prefers busyDates when
        // both are present, so the two must never be sent together.
        body: JSON.stringify({
          name,
          availableDates,
          responseId: editor?.responseId,
          editToken: editor?.editToken,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          clearSavedEditor(groupId);
          setEditor(null);
        }

        throw new Error(payload.error || "Unable to save your response.");
      }

      setGroup(payload.group);
      setEditor(payload.editor);
      writeSavedEditor(groupId, payload.editor);
      setFeedback(editor ? "Dates updated." : "Dates saved.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  const calendarMonths = buildCalendarMonths(group.dateSummaries);
  const pickedSet = new Set(availableDates);
  const isPicked = (date) => pickedSet.has(date);

  let answer;

  if (group.responseCount === 0) {
    answer = "No replies yet. Tap the dates you can make.";
  } else if (group.responseCount === 1) {
    answer = "Waiting for the first reply from anyone else.";
  } else if (group.commonDates.length === 0) {
    answer = "No date works for everyone yet.";
  } else {
    answer = null;
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-6 sm:px-6 lg:px-10">
      <div className="flex flex-col gap-3.5 py-5 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:py-8">
        <div className="min-w-0">
          <Link
            href="/"
            className="label inline-flex min-h-11 items-center underline decoration-rule underline-offset-[3px] transition-colors hover:text-ink"
          >
            Create another group
          </Link>
          <h1 className="font-display text-[clamp(1.85rem,8vw,2.9rem)] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance">
            {group.name}
          </h1>
          <p className="mt-1 font-mono text-xs tabular-nums text-ink-2">
            <b className="font-medium text-ink">{group.responseCount}</b>{" "}
            {group.responseCount === 1 ? "reply" : "replies"}
            {" · "}
            <b className="font-medium text-ink">{group.dates.length}</b> dates
          </p>
        </div>

        {/* Not disabled while shareUrl fills in on hydration — that renders the
            one obvious action greyed out on load. handleCopyLink guards. */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="btn-quiet shrink-0 self-start"
        >
          <CopyIcon />
          {copyState === "copied"
            ? "Link copied"
            : copyState === "error"
              ? "Copy failed"
              : "Copy link"}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-start lg:gap-7 [&>*]:min-w-0">
        <section className="stack px-3.5 pt-[18px] pb-4 sm:px-5">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
            <p className="label text-box-ink">The stack</p>

            <div
              role="group"
              aria-label="View"
              className="inline-flex gap-[3px] rounded-md border border-box-rule bg-[#0d130f] p-[3px]"
            >
              <ViewButton
                selected={viewMode === "calendar"}
                onClick={() => setViewMode("calendar")}
              >
                Calendar
              </ViewButton>
              <ViewButton
                selected={viewMode === "list"}
                onClick={() => setViewMode("list")}
              >
                List
              </ViewButton>
            </div>
          </div>

          <p
            aria-live="polite"
            className="mb-4 border-b border-box-rule pb-3.5 font-mono text-[0.8125rem] tabular-nums text-box-ink"
          >
            {answer ?? (
              <>
                <span className="font-medium text-lamp-soft">
                  {joinLabels(
                    group.commonDates.map((date) => formatShortLabel(date.date)),
                  )}
                </span>
                {group.commonDates.length === 1 ? " works" : " work"} for all{" "}
                {group.responseCount} who have replied.
              </>
            )}
          </p>

          {viewMode === "calendar" ? (
            <CalendarGrid
              months={calendarMonths}
              responseCount={group.responseCount}
              isPicked={isPicked}
              onToggle={toggleDate}
            />
          ) : (
            <DateList
              dateSummaries={group.dateSummaries}
              responseCount={group.responseCount}
              isPicked={isPicked}
              onToggle={toggleDate}
            />
          )}

          <Legend />
        </section>

        <form
          onSubmit={handleSubmit}
          className="card flex flex-col gap-[15px] px-4 py-[18px] sm:px-5 lg:sticky lg:top-7"
        >
          <div className="flex flex-col gap-[7px]">
            <label htmlFor="your-name" className="label">
              Your name
            </label>
            <input
              id="your-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              className="input-field"
              maxLength={50}
            />
          </div>

          <p className="min-h-[1.4em] font-mono text-xs text-ink-2">
            {availableDates.length === 0
              ? "Tap the dates you can make."
              : `You can make ${availableDates.length} ${availableDates.length === 1 ? "date" : "dates"}.`}
          </p>

          {error ? <p className="notice notice-error">{error}</p> : null}

          <button type="submit" disabled={isSaving} className="btn w-full justify-between">
            {isSaving ? "Saving..." : editor ? "Update your dates" : "Save your dates"}
            <Arrow />
          </button>

          <p aria-live="polite" className="min-h-[1.4em] font-mono text-xs text-ink">
            {feedback}
          </p>
        </form>
      </div>

      <section className="mt-6 flex flex-col gap-2.5 border-t border-rule pt-[18px]">
        <p className="label">Replied so far</p>
        <ul className="flex list-none flex-wrap gap-1.5 p-0">
          {group.responses.length === 0 ? (
            <li className="rounded-full border border-dashed border-rule px-[11px] py-1.5 font-mono text-xs text-ink-2">
              Nobody yet
            </li>
          ) : (
            group.responses.map((response) => (
              <li
                key={response.id}
                className={`rounded-full border px-[11px] py-1.5 font-mono text-xs ${
                  editor?.responseId === response.id
                    ? "border-ink bg-surface text-ink"
                    : "border-rule bg-surface text-ink-2"
                }`}
              >
                {response.name}
              </li>
            ))
          )}
        </ul>
      </section>
    </main>
  );
}

function ViewButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-[4px] border-0 px-[13px] font-mono text-[0.6875rem] tracking-[0.08em] uppercase transition-colors ${
        selected ? "bg-lamp-soft text-box" : "bg-transparent text-box-ink"
      }`}
    >
      {children}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect
        x="5.5"
        y="5.5"
        width="9"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10.5 3.5v-1a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
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
