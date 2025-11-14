import { TopicBoard } from "@/components/topic-board";
import { fetchAllTopics } from "@/lib/sources";

export default async function Home() {
  const topics = await fetchAllTopics();
  const generatedAt = new Date().toISOString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-white to-violet-100 py-16 text-zinc-900 antialiased dark:from-zinc-950 dark:via-zinc-950 dark:to-violet-950 dark:text-zinc-50">
      <main className="mx-auto max-w-6xl px-6 lg:px-8">
        <TopicBoard
          initialTopics={topics}
          initialGeneratedAt={generatedAt}
        />
      </main>
      <footer className="mx-auto mt-16 flex max-w-6xl items-center justify-between px-6 text-xs text-zinc-500 dark:text-zinc-400">
        <span>© {new Date().getFullYear()} Build Your System · Research Agent</span>
        <span>Powered by Next.js · Deployed on Vercel</span>
      </footer>
    </div>
  );
}
