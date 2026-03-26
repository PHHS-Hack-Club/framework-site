import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getClient() {
    const endpoint = process.env.MINIO_ENDPOINT;
    const accessKeyId = process.env.MINIO_USERNAME;   // MinIO username
    const secretAccessKey = process.env.MINIO_PASSWORD; // MinIO password

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        throw new Error("Missing MinIO environment variables (MINIO_ENDPOINT, MINIO_USERNAME, MINIO_PASSWORD)");
    }

    return new S3Client({
        endpoint,
        region: "us-east-1", // MinIO ignores region but the SDK requires one
        credentials: { accessKeyId, secretAccessKey },
        forcePathStyle: true, // required for MinIO
    });
}

function getBucket() {
    const bucket = process.env.MINIO_BUCKET;
    if (!bucket) throw new Error("Missing MINIO_BUCKET environment variable");
    return bucket;
}

export async function uploadFile(key: string, body: Buffer, contentType: string) {
    const client = getClient();
    await client.send(new PutObjectCommand({
        Bucket: getBucket(),
        Key: key,
        Body: body,
        ContentType: contentType,
    }));
}

export async function getFileStream(key: string) {
    const client = getClient();
    const response = await client.send(new GetObjectCommand({
        Bucket: getBucket(),
        Key: key,
    }));
    return response;
}

export async function getPresignedUrl(key: string, expiresIn = 3600) {
    const client = getClient();
    return getSignedUrl(
        client,
        new GetObjectCommand({ Bucket: getBucket(), Key: key }),
        { expiresIn }
    );
}
