import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function DELETE(req: Request) {
  return new Response("DEMO");

  const { selected }: { selected: true | number[] } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  if (selected === true) {
    await sql("UPDATE items SET deleted = true WHERE items.store_id = $1", [
      user.id,
    ]);
  }

  await sql(
    "UPDATE items SET deleted = true WHERE items.id = ANY($1) AND items.store_id = $2",
    [selected, user.id],
  );

  return new Response("OK");
}
