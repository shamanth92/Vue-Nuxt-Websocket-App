// server/utils/s3Client.ts
import { S3Client } from '@aws-sdk/client-s3';

export const getS3Client = () => {
  const config = useRuntimeConfig();
  
  return new S3Client({
    region: config.awsRegion,
    credentials: {
      accessKeyId: config.awsAccessKeyId,
      secretAccessKey: config.awsSecretAccessKey,
    },
  });
};