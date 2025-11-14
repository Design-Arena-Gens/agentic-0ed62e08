"use client";

import { useMemo, useState, useTransition } from "react";

import { Topic, TopicCategory } from "@/lib/types";

import { TopicCard } from "./topic-card";

const CATEGORY_ORDER: TopicCategory[] = [
  "Breaking News",
  "AI",
  "Wealth Building",
  "Financial Freedom",
  "Money Psychology",
  "Personal Finance Tools",
];

type SignalFilter = "all" | "tier1" | "ai" | "psychology" | "wealth";

export function TopicBoard({
  initialTopics,
  initialGeneratedAt,
}: {
  initialTopics: Topic[];
  initialGeneratedAt: string;
}) {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [generatedAt, setGeneratedAt] = useState(initialGeneratedAt);
  const [category, setCategory] = useState<TopicCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [signalFilter, setSignalFilter] = useState<SignalFilter>("all");
  const [isRefreshing, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const haystack = search.trim().toLowerCase();
    return topics.filter((topic) => {
      if (category !== "all" && topic.category !== category) {
        return false;
      }
      if (haystack.length > 1) {
        const combined = `${topic.title} ${topic.summary} ${topic.source}`.toLowerCase();
        if (!combined.includes(haystack)) {
          return false;
        }
      }
      switch (signalFilter) {
        case "tier1":
          return topic.signals.tier1Focus;
        case "ai":
          return topic.signals.aiAngle;
        case "psychology":
          return topic.signals.moneyPsychologyAngle;
        case "wealth":
          return topic.signals.wealthStrategyAngle;
        default:
          return true;
      }
    });
  }, [category, search, signalFilter, topics]);

  const metrics = useMemo(() => {
    const counts: Record<TopicCategory, number> = {
      AI: 0,
      "Money Psychology": 0,
      "Wealth Building": 0,
      "Financial Freedom": 0,
      "Breaking News": 0,
      "Personal Finance Tools": 0,
    };

    for (const topic of topics) {
      counts[topic.category] += 1;
    }

    const tier1 = topics.filter((topic) => topic.signals.tier1Focus).length;
    const ai = topics.filter((topic) => topic.signals.aiAngle).length;
    const psychology = topics.filter(
      (topic) => topic.signals.moneyPsychologyAngle,
    ).length;
    const wealth = topics.filter((topic) => topic.signals.wealthStrategyAngle)
      .length;

    return {
      counts,
      tier1,
      ai,
      psychology,
      wealth,
    };
  }, [topics]);

  const headlineTopic = filtered[0] ?? topics[0];

  const handleRefresh = () => {
    startTransition(async () => {
      const response = await fetch("/api/topics", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setTopics(data.topics);
      setGeneratedAt(data.generatedAt);
    });
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-violet-100 via-sky-100 to-white p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:from-violet-950 dark:via-slate-950 dark:to-zinc-950">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-1 text-xs font-bold uppercase tracking-widest text-violet-700 dark:border-violet-900/40 dark:bg-violet-950/60 dark:text-violet-200">
              Build Your System · Daily AI Finance Radar
            </span>
            <h1 className="text-4xl font-bold leading-tight text-zinc-950 dark:text-zinc-50">
              Long-form topic intelligence for AI-powered wealth creators
            </h1>
            <p className="text-lg leading-7 text-zinc-700 dark:text-zinc-300">
              Synthesizing cross-platform signals from YouTube, Reddit, Google
              News, Hacker News, and Tier-1 finance publishers. Filter by angle,
              surface high-impact narratives, and plan your next deep-dive.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 rounded-2xl border border-violet-200 bg-white/70 px-5 py-4 text-sm text-zinc-700 shadow-sm backdrop-blur dark:border-violet-900/40 dark:bg-zinc-900/60 dark:text-zinc-200">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live feed updated
            </div>
            <div className="font-semibold">
              {new Date(generatedAt).toLocaleString()}
            </div>
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-violet-500 disabled:opacity-60"
              disabled={isRefreshing}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Signals"}
            </button>
          </div>
        </header>

        {headlineTopic ? (
          <div className="mt-8 flex flex-col gap-6 rounded-2xl bg-white/80 p-6 shadow-inner backdrop-blur dark:bg-zinc-900/80">
            <div className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Featured Insight
            </div>
            <div className="space-y-4">
              <a
                href={headlineTopic.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-semibold leading-snug text-zinc-900 transition hover:text-violet-600 dark:text-zinc-50 dark:hover:text-violet-300"
              >
                {headlineTopic.title}
              </a>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {headlineTopic.summary}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                  {headlineTopic.source}
                </span>
                <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
                  {headlineTopic.category}
                </span>
                {headlineTopic.engagement ? (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
                    {headlineTopic.engagement}
                  </span>
                ) : null}
              </div>
              <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                {headlineTopic.actionAngles.map((angle, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-violet-500" />
                    <span>{angle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Total Signals</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {topics.length}
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Aggregate topics sourced from 5 channels across Tier-1 markets.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">AI Angles</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {metrics.ai}
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            High-potential stories connecting AI with money, wealth, and habits.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Tier-1 Ready</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {metrics.tier1}
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Signals already referencing US, UK, CA, AU, or Western Europe.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium text-zinc-500">Wealth Playbooks</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            {metrics.wealth}
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Stories with a clear roadmap to financial freedom or asset growth.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCategory("all")}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                category === "all"
                  ? "border-violet-500 bg-violet-500 text-white"
                  : "border-zinc-200 text-zinc-600 hover:border-violet-200 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-300"
              }`}
            >
              All
            </button>
            {CATEGORY_ORDER.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  category === item
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-zinc-200 text-zinc-600 hover:border-violet-200 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {item} ({metrics.counts[item]})
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SignalChip
              label="Tier-1 focus"
              active={signalFilter === "tier1"}
              onClick={() =>
                setSignalFilter(signalFilter === "tier1" ? "all" : "tier1")
              }
            />
            <SignalChip
              label="AI x Finance"
              active={signalFilter === "ai"}
              onClick={() =>
                setSignalFilter(signalFilter === "ai" ? "all" : "ai")
              }
            />
            <SignalChip
              label="Money psychology"
              active={signalFilter === "psychology"}
              onClick={() =>
                setSignalFilter(
                  signalFilter === "psychology" ? "all" : "psychology",
                )
              }
            />
            <SignalChip
              label="Wealth strategies"
              active={signalFilter === "wealth"}
              onClick={() =>
                setSignalFilter(signalFilter === "wealth" ? "all" : "wealth")
              }
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Displaying {filtered.length} of {topics.length} active topics.
          </div>
          <div className="relative w-full max-w-sm">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm text-zinc-700 shadow-inner outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:focus:border-violet-500 dark:focus:ring-violet-900/40"
              placeholder="Search narratives, sources, keywords…"
              type="search"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider text-zinc-400">
              ⌘K
            </span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
          {filtered.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              No topics match the current filters. Reset filters or refresh the
              live feed.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function SignalChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-emerald-500 bg-emerald-500 text-white"
          : "border-zinc-200 text-zinc-600 hover:border-emerald-200 hover:text-emerald-600 dark:border-zinc-700 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}
