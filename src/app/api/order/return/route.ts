import { ReturnRequest } from "@/components/email/ReturnRequest";
import { ReturnRequestStore } from "@/components/email/ReturnRequestStore";
import sql from "@/utils/db";
import getUser from "@/utils/getUser";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(req: Request) {
  const { nano_id } = await req.json();
  const { user } = await getUser();

  if (!user || !nano_id) return new Response(null, { status: 401 });

  const [order] = await sql(
    "SELECT status FROM orders WHERE nano_id = $1 AND user_id = $2",
    [nano_id, user?.id],
  );

  if (order?.status !== "completed") return new Response(null, { status: 400 });

  await sql(
    "UPDATE orders SET status = 'return_requested' WHERE nano_id = $1 AND user_id = $2",
    [nano_id, user?.id],
  );

  await sql(
    "INSERT INTO order_status_history (order_id, status) VALUES ((SELECT id FROM orders WHERE nano_id = $1), 'return_requested')",
    [nano_id],
  );

  await resend.emails.send({
    from:
      process.env.NODE_ENV === "development"
        ? "Atlas <delivered@resend.dev>"
        : "Atlas <returns@atlas.me>",
    to:
      process.env.NODE_ENV === "development"
        ? [process.env.TEST_EMAIL as string]
        : [user.email],
    subject: "Your return request - Atlas",
    text: "Your return request",
    react: ReturnRequest({ nano_id: nano_id }),
  });

  await resend.emails.send({
    from:
      process.env.NODE_ENV === "development"
        ? "Atlas <delivered@resend.dev>"
        : "Atlas <returns@atlas.me>",
    to:
      process.env.NODE_ENV === "development"
        ? [process.env.TEST_EMAIL as string]
        : [
            (
              await sql(
                "SELECT email FROM users WHERE id = (SELECT store_id FROM orders WHERE nano_id = $1)",
                [nano_id],
              )
            )[0]?.email,
          ],
    subject: "Return requested - Atlas",
    text: "Return requested",
    react: ReturnRequestStore({ nano_id: nano_id }),
  });

  return new Response("OK");
}
