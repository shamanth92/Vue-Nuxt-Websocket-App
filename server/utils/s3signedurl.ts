// server/utils/s3.ts
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getS3Client } from './s3client';

export const generateSignedUrl = async (s3Key: string, folder?: string): Promise<string> => {
  const config = useRuntimeConfig();
  const s3Client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: config.awsS3BucketName,
    Key: folder ? `${folder}/${s3Key}` : s3Key,
  });

  // Generate signed URL that expires in 1 hour (3600 seconds)
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600, // URL valid for 1 hour
  });

  return signedUrl;
};