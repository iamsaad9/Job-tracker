export async function GET() {
  return new Response(JSON.stringify({ mongoUri: process.env.MONGO_URI || "NOT FOUND" }));
}