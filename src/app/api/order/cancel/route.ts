import sql from "@/utils/db";
import getUser from "@/utils/getUser";
import { Resend } from "resend";
import { OrderCancelled } from "@/components/email/OrderCancelled";
import { OrderCancelledStore } from "@/components/email/OrderCancelledStore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(req: Request) {
  const { nano_id } = await req.json();
  const { user } = await getUser();

  if (!user || !nano_id) return new Response(null, { status: 401 });

  const [order] = await sql(
    "SELECT status FROM orders WHERE nano_id = $1 AND user_id = $2",
    [nano_id, user?.id],
  );

  if (order?.status !== "pending") return new Response(null, { status: 400 });

  await sql(
    "UPDATE orders SET status = 'customer_cancelled' WHERE nano_id = $1 AND user_id = $2",
    [nano_id, user?.id],
  );

  await sql(
    "UPDATE item_configs SET quantity = item_configs.quantity + 1 FROM order_items WHERE order_items.order_id = (SELECT id FROM orders WHERE nano_id = $1) AND item_configs.color = order_items.color AND item_configs.size = order_items.size AND item_configs.item_id = order_items.item_id",
    [nano_id],
  );

  await sql(
    "INSERT INTO order_status_history (order_id, status) VALUES ((SELECT id FROM orders WHERE nano_id = $1), 'customer_cancelled')",
    [nano_id],
  );

  await resend.emails.send({
    from:
      process.env.NODE_ENV === "development"
        ? "Atlas <delivered@resend.dev>"
        : "Atlas <orders@atlas.me>",
    to:
      process.env.NODE_ENV === "development"
        ? [process.env.TEST_EMAIL as string]
        : [user.email],
    subject: "Your order has been cancelled - Atlas",
    text: "Your order has been cancelled",
    react: OrderCancelled({ nano_id: nano_id }),
  });

  await resend.emails.send({
    from:
      process.env.NODE_ENV === "development"
        ? "Atlas <delivered@resend.dev>"
        : "Atlas <orders@atlas.me>",
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
    subject: "An order has been cancelled - Atlas",
    text: "An order has been cancelled",
    react: OrderCancelledStore({ nano_id: nano_id }),
  });

  return new Response("OK");
}
