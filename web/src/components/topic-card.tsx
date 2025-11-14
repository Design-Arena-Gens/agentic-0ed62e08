import { Topic } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryColorMap: Record<Topic["category"], string> = {
  AI: "bg-purple-100 text-purple-700 border-purple-200",
  "Money Psychology": "bg-rose-100 text-rose-700 border-rose-200",
  "Wealth Building": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "Financial Freedom": "bg-sky-100 text-sky-700 border-sky-200",
  "Breaking News": "bg-amber-100 text-amber-700 border-amber-200",
  "Personal Finance Tools": "bg-indigo-100 text-indigo-700 border-indigo-200",
};

export function TopicCard({ topic }: { topic: Topic }) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
            categoryColorMap[topic.category],
          )}
        >
          {topic.category}
        </span>
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {topic.publishedAt
            ? new Date(topic.publishedAt).toLocaleString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                month: "short",
                day: "numeric",
              })
            : "Recently"}
        </span>
      </header>

      <div className="mt-4 space-y-3">
        <h3 className="text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
          <a
            href={topic.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-violet-600 dark:hover:text-violet-400"
          >
            {topic.title}
          </a>
        </h3>
        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          {topic.summary}
        </p>
      </div>

      <footer className="mt-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="font-semibold text-zinc-700 dark:text-zinc-200">
            {topic.source}
          </span>
          {topic.engagement ? (
            <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
              {topic.engagement}
            </span>
          ) : null}
          <span
            className={cn(
              "rounded-full px-2 py-1",
              topic.signals.tier1Focus
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
            )}
          >
            Tier-1 Relevance: {topic.signals.tier1Focus ? "High" : "Needs angle"}
          </span>
          {topic.signals.aiAngle ? (
            <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200">
              AI Advantage
            </span>
          ) : null}
          {topic.signals.moneyPsychologyAngle ? (
            <span className="rounded-full bg-rose-100 px-2 py-1 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
              Psychology Hook
            </span>
          ) : null}
          {topic.signals.wealthStrategyAngle ? (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
              Wealth Tactic
            </span>
          ) : null}
        </div>

        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
          {topic.actionAngles.map((angle, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-violet-500" />
              <span>{angle}</span>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
}
