import getUser from "@/utils/getUser";
import {
  canGenerateCode,
  codeExpired,
  generateCode,
} from "@/utils/emailVerification";

export async function GET() {
  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  if (await codeExpired(user.id)) generateCode(user.id, user.name, user.email);

  return new Response((await canGenerateCode(user.id)).toString());
}
