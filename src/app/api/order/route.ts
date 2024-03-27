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
    "SELECT governorate, status, first_name, status NOT IN ('shipped', 'confirmed') AS address_hidden, (CASE WHEN status NOT IN ('shipped', 'confirmed') THEN null ELSE city END) AS city, (CASE WHEN status NOT IN ('shipped', 'confirmed') THEN null ELSE street END) AS street, (CASE WHEN status NOT IN ('shipped', 'confirmed') THEN null ELSE apartment END) AS apartment, (CASE WHEN status NOT IN ('shipped', 'confirmed') THEN null ELSE last_name END) AS last_name, (CASE WHEN status NOT IN ('shipped', 'confirmed') THEN null ELSE phone_number END) AS phone_number FROM orders WHERE nano_id = $1 AND store_id = $2",
    [nano_id, user.id]
  );

  return new Response(JSON.stringify(data[0]));
}
