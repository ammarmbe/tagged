import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  const { name } = await req.json();
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  if (!name || name.length > 50 || name.length < 3) {
    return new Response(JSON.stringify(null), {
      status: 400,
    });
  }

  await sql("UPDATE users SET name = $1 WHERE id = $2 AND store = true", [
    name,
    user.id,
  ]);

  return new Response("OK");
}
