import sql from "@/utils/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nano_id = searchParams.get("nano_id");

  const data = await sql(
    "SELECT users.name, feature_flags ->> 'description' AS description, feature_flags ->> 'instagram' AS instagram, feature_flags ->> 'facebook' AS facebook, feature_flags ->> 'tiktok' AS tiktok FROM users WHERE nano_id = $1",
    [nano_id],
  );

  return new Response(JSON.stringify(data[0]), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
