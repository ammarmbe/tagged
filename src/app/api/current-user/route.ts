import getUser from "@/utils/getUser";

export async function GET() {
  const { user } = await getUser();

  return new Response(JSON.stringify(user));
}
