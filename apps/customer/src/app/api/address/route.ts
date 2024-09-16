import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  if (!user) {
    return new Response(JSON.stringify({}), {
      status: 401,
    });
  }

  const data = await sql(
    "SELECT (address).*, first_name, governorate, (address).phone_number AS number FROM users WHERE id = $1",
    [user.id],
  );

  return new Response(JSON.stringify({ ...data[0], ...data[0]?.address }));
}

export async function POST(req: Request) {
  const {
    street,
    apartment,
    city,
    governorate,
    number,
    first_name,
    last_name,
  } = await req.json();
  const { user } = await getUser();

  if (!user) {
    return new Response("Not signed in", {
      status: 401,
    });
  }

  await sql(
    "UPDATE users SET first_name = $1, governorate = $2, address = ROW($3, $4, $5, $6, $7) WHERE id = $8",
    [
      first_name,
      governorate,
      street,
      apartment,
      city,
      number.startsWith("1") ? "0" + number : number,
      last_name,
      user?.id,
    ],
  );

  return new Response("OK");
}
