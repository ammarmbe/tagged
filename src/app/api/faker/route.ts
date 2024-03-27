import { customAlphabet } from "nanoid";
import { faker } from "@faker-js/faker";
import sql from "@/utils/db";

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

function generateCategories() {
  const categories = [
    "Jackets",
    "Dresses",
    "Shoes",
    "Accessories",
    "Tops:Tshirts",
    "Tops:Shirts",
    "Tops:Hoodies",
    "Tops:Sweatshirts",
    "Bottoms:Shorts",
    "Bottoms:Jeans",
    "Bottoms:Sweatpants",
    "Bottoms:Cargo",
    "Bottoms:Leggings",
  ];
  return faker.helpers.arrayElement(categories).split(":");
}

export async function GET() {
  for (let i = 0; i < 50; i++) {
    // Adjust the loop for the desired number of items
    const nanoId = nanoid();
    const name = faker.commerce.productName();
    const description = faker.lorem.sentence();
    const price =
      Math.round(faker.number.int({ min: 500, max: 1000 }) / 50) * 50; // Adjust min and max price as needed
    const discount =
      Math.round(faker.number.int({ min: 0, max: 400 }) / 50) * 50; // Adjust min and max discount as needed
    const categories = generateCategories();

    // Inserting data into the items table
    await sql(
      "INSERT INTO items (nano_id, name, description, price, discount, categories, store_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        nanoId,
        name,
        description,
        price,
        discount,
        categories,
        "hlgiy6kqwxwx7i6",
      ]
    );

    console.log(`Inserted item ${i + 1}`);
  }

  return new Response("OK");
}
