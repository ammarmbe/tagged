import sql from "@/utils/db";
import getUser from "@/utils/getUser";

export async function POST(req: Request) {
  const {
    availability,
    name,
    quantity_min,
    quantity_max,
    price_min,
    price_max,
    category,
    discount,
    discount_min,
    discount_max,
    revenue_min,
    revenue_max,
    orderBy,
    limit,
    pageParam,
  }: {
    availability: "all" | "in_stock" | "out_of_stock";
    name: string;
    quantity_min: number;
    quantity_max: number;
    price_min: number;
    price_max: number;
    category: string;
    discount: boolean;
    discount_min: number;
    discount_max: number;
    revenue_min: number;
    revenue_max: number;
    orderBy: {
      column:
        | "name"
        | "quantity"
        | "price"
        | "category"
        | "discount"
        | "revenue"
        | "status";
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

  let query = `SELECT COUNT(*) OVER() AS total_count, items.nano_id AS nano_id, items.id AS id, items.name AS name, items.price AS price, items.discount AS discount, items.categories AS category, coalesce((SELECT SUM(item_details.quantity) FROM item_details WHERE item_details.item_id = items.id), 0) AS quantity, (SELECT SUM((order_items.price - order_items.discount) * order_items.quantity) FROM order_items WHERE order_items.item_id = items.id) AS revenue FROM items WHERE items.store_id = $1 AND items.id > $2 AND items.deleted = false`;
  const params: (string | number)[] = [user.id, pageParam || 0];

  if (name) {
    params.push(name);
    query += ` AND items.name % $${params.length}`;
  }

  if (availability === "in_stock" || availability === "out_of_stock") {
    query += ` AND coalesce((SELECT SUM(item_details.quantity) FROM item_details WHERE item_details.item_id = items.id), 0) ${
      availability === "in_stock" ? ">" : "="
    } 0`;
  }

  if (quantity_min) {
    params.push(quantity_min);
    query += ` AND (SELECT SUM(item_details.quantity) FROM item_details WHERE item_details.item_id = items.id) >= $${params.length}`;
  }

  if (quantity_max) {
    params.push(quantity_max);
    query += ` AND (SELECT SUM(item_details.quantity) FROM item_details WHERE item_details.item_id = items.id) <= $${params.length}`;
  }

  if (price_min) {
    params.push(price_min);
    query += ` AND items.price >= $${params.length}`;
  }

  if (price_max) {
    params.push(price_max);
    query += ` AND items.price <= $${params.length}`;
  }

  if (category) {
    params.push(category);
    query += ` AND $${params.length} ILIKE ANY(items.categories)`;
  }

  if (discount) {
    query += ` AND items.discount > 0`;
  }

  if (discount_min) {
    params.push(discount_min);
    query += ` AND items.discount >= $${params.length}`;
  }

  if (discount_max) {
    params.push(discount_max);
    query += ` AND items.discount <= $${params.length}`;
  }

  if (revenue_min) {
    params.push(revenue_min);
    query += ` AND (SELECT SUM((order_items.price - order_items.discount) * order_items.quantity) FROM order_items WHERE order_items.item_id = items.id) >= $${params.length}`;
  }

  if (revenue_max) {
    params.push(revenue_max);
    query += ` AND (SELECT SUM((order_items.price - order_items.discount) * order_items.quantity) FROM order_items WHERE order_items.item_id = items.id) <= $${params.length}`;
  }

  query += ` GROUP BY items.id`;

  if (orderBy) {
    query += ` ORDER BY ${
      orderBy.column === "revenue"
        ? "revenue"
        : orderBy.column === "category"
          ? "category"
          : orderBy.column === "discount"
            ? "discount"
            : orderBy.column === "quantity"
              ? "quantity"
              : orderBy.column === "price"
                ? "price"
                : orderBy.column === "status"
                  ? "(SELECT SUM(item_details.quantity) FROM item_details WHERE item_details.item_id = items.id) > 0"
                  : orderBy.column === "name"
                    ? "name"
                    : "id"
    } ${orderBy.direction === "asc" ? "ASC NULLS FIRST" : "DESC NULLS LAST"}`;
  }

  query += ` LIMIT $${params.length + 1}`;
  params.push(limit || 20);

  const data = await sql(query, params);

  return new Response(JSON.stringify(data));
}
