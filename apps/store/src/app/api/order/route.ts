import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nano_id = searchParams.get("nano_id");

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  const data = await sql(
    "SELECT governorate, status, orders.nano_id, orders.created_at, orders.shipping_price, orders.cancel_reason, orders.first_name, status NOT IN ('shipped', 'confirmed', 'return_accepted') AS address_hidden, (CASE WHEN status NOT IN ('shipped', 'confirmed', 'return_accepted') THEN null ELSE (orders.address).street END) AS street, (CASE WHEN status NOT IN ('shipped', 'confirmed', 'return_accepted') THEN null ELSE (orders.address).apartment END) AS apartment, (CASE WHEN status NOT IN ('shipped', 'confirmed', 'return_accepted') THEN null ELSE (orders.address).city END) AS city, (CASE WHEN status NOT IN ('shipped', 'confirmed', 'return_accepted') THEN null ELSE (orders.address).phone_number END) AS phone_number, (CASE WHEN status NOT IN ('shipped', 'confirmed', 'return_accepted') THEN null ELSE (orders.address).last_name END) AS last_name FROM orders WHERE nano_id = $1 AND store_id = $2",
    [nano_id, user.id],
  );

  return new Response(JSON.stringify(data[0]));
}
