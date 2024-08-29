import sql from "@/utils/db";
import getUser from "@/utils/getUser";
import { BlobServiceClient } from "@azure/storage-blob";

export async function POST(req: Request) {
  return new Response("DEMO");

  const { user } = await getUser();

  if (!user?.id) {
    return new Response(JSON.stringify(null), { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  const fileBuffer = await file.arrayBuffer();

  const accountName = process.env.ACCOUNT_NAME;
  const sasToken = process.env.SAS_TOKEN;
  const containerName = process.env.CONTAINER_NAME;

  if (!file) return new Response(JSON.stringify(null), { status: 400 });

  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net/?${sasToken}`,
  );
  const containerClient = blobServiceClient.getContainerClient(containerName!);

  const oldBlockBlobClient = containerClient.getBlockBlobClient(
    user.nano_id + "-pfp",
  );
  await oldBlockBlobClient.deleteIfExists();

  const blockBlobClient = containerClient.getBlockBlobClient(
    user.nano_id + "-pfp",
  );

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: {
      blobContentType: file.type,
    },
  });

  const url = blockBlobClient.url;

  await sql("UPDATE users SET pfp_url = $1 WHERE nano_id = $2", [
    url,
    user.nano_id,
  ]);

  return new Response(url, {
    status: 200,
  });
}
