import sql from "@/utils/db";
import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const { searchParams } = new URL(req.url);
  const nano_id = searchParams.get("nano_id");

  const fileBuffer = await file.arrayBuffer();

  const accountName = "taggedimg";
  const sasToken = process.env.SAS_TOKEN;
  const containerName = "tagged";

  if (!file) return new Response(JSON.stringify(null), { status: 400 });

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/?${sasToken}`,
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(name);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });

  const url = blockBlobClient.url;

  if (nano_id)
    await sql(
      "INSERT INTO item_images (item_id, url, id, size) VALUES ((SELECT id FROM items WHERE nano_id = $1), $2, $3, $4)",
      [nano_id, url, name, fileBuffer.byteLength],
    );

  return new Response(url, {
    status: 200,
  });
}

export async function DELETE(req: Request) {
  const body = (await req.json()) as {
    id: string;
  };

  const accountName = process.env.ACCOUNT_NAME;
  const sasToken = process.env.SAS_TOKEN;
  const containerName = process.env.CONTAINER_NAME;

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/?${sasToken}`,
  );
  const containerClient = blobServiceClient.getContainerClient(containerName!);
  const blockBlobClient = containerClient.getBlockBlobClient(body.id);

  await blockBlobClient.deleteIfExists();

  await sql("DELETE FROM item_images WHERE id = $1", [body.id]);

  return new Response("OK");
}
