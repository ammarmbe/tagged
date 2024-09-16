import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(null, { status: 401 });
  }

  await sql("UPDATE items SET deleted = true WHERE store_id = $1 AND id = $2", [
    user.id,
    id,
  ]);

  return new Response("OK");
}
