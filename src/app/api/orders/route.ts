import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const {
    status,
    total_price_min,
    total_price_max,
    total_items_min,
    total_items_max,
    total_discount_min,
    total_discount_max,
    governorates,
    created_at_min,
    created_at_max,
    orderBy,
    limit,
    pageParam,
  }: {
    status:
      | "pending"
      | "confirmed"
      | "shipped"
      | "completed"
      | "store_cancelled"
      | "customer_cancelled"
      | "return_requested"
      | "return_declined"
      | "return_accepted"
      | "returned";
    total_price_min: number;
    total_price_max: number;
    total_items_min: number;
    total_items_max: number;
    total_discount_min: number;
    total_discount_max: number;
    governorates: string[];
    created_at_min: string;
    created_at_max: string;
    orderBy: {
      column:
        | "status"
        | "total_price"
        | "total_items"
        | "total_discount"
        | "governorate"
        | "created_at";
      direction: "asc" | "desc";
    };
    limit: number;
    pageParam: number;
  } = await req.json();

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), {
      status: 401,
    });
  }

  let query = `SELECT COUNT(*) OVER() AS total_count, orders.id AS as, orders.nano_id AS nano_id, orders.status AS status, SUM(order_items.discount) AS total_discount, SUM(order_items.price) AS total_price, COUNT(order_items) AS total_items, orders.governorate AS governorate, orders.created_at AS created_at FROM orders LEFT JOIN order_items ON order_items.order_id = orders.id WHERE orders.store_id = $1 AND orders.id > $2`;
  const params: (string | number | string[])[] = [user.id, pageParam || 0];

  if (status) {
    params.push(status);
    query += ` AND orders.status = $${params.length}`;
  }

  if (total_price_min) {
    params.push(total_price_min);
    query += ` AND SUM(order_items.price) >= $${params.length}`;
  }

  if (total_price_max) {
    params.push(total_price_max);
    query += ` AND SUM(order_items.price) <= $${params.length}`;
  }

  if (total_items_min) {
    params.push(total_items_min);
    query += ` AND COUNT(order_items) >= $${params.length}`;
  }

  if (total_items_max) {
    params.push(total_items_max);
    query += ` AND COUNT(order_items) <= $${params.length}`;
  }

  if (total_discount_min) {
    params.push(total_discount_min);
    query += ` AND SUM(order_items.discount) >= $${params.length}`;
  }

  if (total_discount_max) {
    params.push(total_discount_max);
    query += ` AND SUM(order_items.discount) <= $${params.length}`;
  }

  if (governorates) {
    params.push(governorates);
    query += ` AND orders.governorate = ANY($${params.length})`;
  }

  if (created_at_min) {
    params.push(created_at_min);
    query += ` AND orders.created_at >= $${params.length}`;
  }

  if (created_at_max) {
    params.push(created_at_max);
    query += ` AND orders.created_at <= $${params.length}`;
  }

  query += ` GROUP BY orders.id`;

  if (orderBy) {
    query += ` ORDER BY ${
      orderBy.column === "total_items"
        ? "COUNT(order_items)"
        : orderBy.column === "total_price"
          ? "SUM(order_items.price)"
          : orderBy.column === "total_discount"
            ? "SUM(order_items.discount)"
            : orderBy.column === "created_at"
              ? "orders.created_at"
              : orderBy.column === "governorate"
                ? "governorate"
                : orderBy.column === "status"
                  ? "status"
                  : "orders.id"
    } ${orderBy.direction === "asc" ? "ASC NULLS FIRST" : "DESC NULLS LAST"}`;
  }

  query += ` LIMIT $${params.length + 1}`;
  params.push(limit || 20);

  const data = await sql(query, params);

  return new Response(JSON.stringify(data));
}
