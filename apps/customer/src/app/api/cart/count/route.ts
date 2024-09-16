import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user) {
    return new Response("Not signed in", {
      status: 401,
    });
  }

  const data = await sql(
    "SELECT SUM(quantity) as count FROM cart_items WHERE user_id = $1",
    [user.id],
  );

  return new Response(data[0]?.count ?? 0);
}
