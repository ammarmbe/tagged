import "server-only";
import { Resend } from "resend";
import sql from "@/utils/db";
import { NewOrderStore } from "@/components/email/NewOrderStore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewOrderEmailToStore(
  order_id: string,
  email: string,
) {
  const [order] = (await sql(
    "SELECT orders.created_at, orders.nano_id, orders.shipping_price, orders.governorate, orders.first_name as customer_name, users.name as store_name, (SELECT SUM((order_items.price - order_items.discount) * order_items.quantity) FROM order_items WHERE order_items.order_id = orders.id) as total FROM orders JOIN order_items ON order_items.order_id = orders.id JOIN users ON users.id = orders.store_id WHERE orders.id = $1 GROUP BY orders.id, users.name",
    [order_id],
  )) as {
    governorate: string;
    nano_id: string;
    created_at: string;
    shipping_price: number;
    store_name: string;
    store_id: number;
    customer_name: string;
    total: number;
  }[];

  const items = (await sql(
    "SELECT order_items.*, (SELECT url FROM item_images WHERE item_id = order_items.item_id ORDER BY thumbnail DESC NULLS LAST LIMIT 1) AS image_url FROM order_items WHERE order_id = $1",
    [order_id],
  )) as {
    color: string;
    description: string;
    discount: number;
    id: number;
    image_url: string;
    item_id: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    order_id: number;
  }[];

  await resend.emails.send({
    from:
      process.env.NODE_ENV === "development"
        ? "Atlas <delivered@resend.dev>"
        : "Atlas <order@atlas.me>",
    to:
      process.env.NODE_ENV === "development"
        ? [process.env.TEST_EMAIL as string]
        : [email],
    subject: `New order from ${order.customer_name} - Atlas`,
    text: `New order from ${order.customer_name} - Atlas`,
    react: NewOrderStore({
      order,
      items,
    }),
  });
}
