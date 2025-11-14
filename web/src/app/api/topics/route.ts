import { fetchAllTopics } from "@/lib/sources";

export const dynamic = "force-dynamic";

export async function GET() {
  const topics = await fetchAllTopics();
  return Response.json({
    generatedAt: new Date().toISOString(),
    topics,
  });
}
