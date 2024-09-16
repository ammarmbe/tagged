import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function PATCH(req: Request) {
  return new Response("DEMO");

  const { email } = await req.json();
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  if (
    !email ||
    email.length > 50 ||
    email.length < 3 ||
    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) === false
  ) {
    return new Response(JSON.stringify(null), {
      status: 400,
    });
  }

  await sql("UPDATE users SET email = $1 WHERE id = $2 AND store = true", [
    email,
    user.id,
  ]);

  return new Response("OK");
}
