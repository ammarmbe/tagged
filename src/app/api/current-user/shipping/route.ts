import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  const data = await sql(
    "SELECT shipping_price AS price, exchange_policy, return_policy, allowed_gov AS allowed_governorates FROM store_settings WHERE store_id = $1",
    [user.id],
  );

  return new Response(JSON.stringify(data[0]));
}
