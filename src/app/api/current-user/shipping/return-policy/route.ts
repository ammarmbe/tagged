import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { returnPolicy } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  await sql(
    "UPDATE store_settings SET return_policy = $1 WHERE store_id = $2",
    [returnPolicy, user.id],
  );

  return new Response("OK");
}
