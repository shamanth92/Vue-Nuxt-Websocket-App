export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", [
    "@formkit/nuxt",
    {
      autoImport: true,
      configFile: "./formkit.config.ts",
    },
  ], "@pinia/nuxt"],
  runtimeConfig: {
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
  },
});