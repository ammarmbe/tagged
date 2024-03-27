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
    "SELECT *, phone_number AS number FROM addresses WHERE user_id = $1",
    [user.id],
  );

  return new Response(JSON.stringify(data[0]), {
    status: 200,
  });
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
    "INSERT INTO addresses (first_name, last_name, street, apartment, city, governorate, phone_number, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (user_id) DO UPDATE SET first_name = $1, last_name = $2, street = $3, apartment = $4, city = $5, governorate = $6, phone_number = $7",
    [
      first_name,
      last_name,
      street,
      apartment,
      city,
      governorate,
      number.startsWith("1") ? "0" + number : number,
      user.id,
    ],
  );

  return new Response("OK", {
    status: 200,
  });
}
